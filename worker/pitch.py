"""
Automatic per-frame pitch calibration — fully self-contained, offline.

A pitch-keypoint model (YOLO-pose, loaded LOCALLY with ultralytics — no Roboflow,
no API key, no network at run time) detects up to 32 known pitch landmarks per
frame. The confident ones give a homography image px -> pitch centimetres via
RANSAC, gated by a reprojection-error check so a bad frame is rejected rather
than poisoning the analytics. Any image point (a player's feet) then maps to a
real pitch coordinate in that frame, even as the broadcast camera pans/zooms.

The 32 world landmarks below are the standard SoccerPitchConfiguration layout
(centimetres, 120x70 m model pitch) — they must match the keypoint ORDER the
model was trained on. Obtain a matching model once with worker/get_pitch_model.py
and point PITCH_MODEL_PATH at the .pt file.
"""
import os

# 32 pitch landmarks in centimetres (x along length 0..12000, y along width 0..7000).
# Standard layout shared by the common open soccer pitch-keypoint models.
L, Wd = 12000, 7000
PBW, PBL = 4100, 2015      # penalty box width / length
GBW, GBL = 1832, 550       # goal box width / length
CCR, PSD = 915, 1100       # centre-circle radius / penalty-spot distance
PITCH_VERTICES = [
    (0, 0), (0, (Wd - PBW) / 2), (0, (Wd - GBW) / 2), (0, (Wd + GBW) / 2),
    (0, (Wd + PBW) / 2), (0, Wd),
    (GBL, (Wd - GBW) / 2), (GBL, (Wd + GBW) / 2),
    (PSD, Wd / 2),
    (PBL, (Wd - PBW) / 2), (PBL, (Wd - GBW) / 2), (PBL, (Wd + GBW) / 2), (PBL, (Wd + PBW) / 2),
    (L / 2, 0), (L / 2, Wd / 2 - CCR), (L / 2, Wd / 2 + CCR), (L / 2, Wd),
    (L - PBL, (Wd - PBW) / 2), (L - PBL, (Wd - GBW) / 2), (L - PBL, (Wd + GBW) / 2), (L - PBL, (Wd + PBW) / 2),
    (L - PSD, Wd / 2),
    (L - GBL, (Wd - GBW) / 2), (L - GBL, (Wd + GBW) / 2),
    (L, 0), (L, (Wd - PBW) / 2), (L, (Wd - GBW) / 2), (L, (Wd + GBW) / 2), (L, (Wd + PBW) / 2), (L, Wd),
    (L / 2 - CCR, Wd / 2), (L / 2 + CCR, Wd / 2),
]

PITCH_LEN_CM, PITCH_WID_CM = float(L), float(Wd)
MIN_CONF = 0.5
MIN_POINTS = 5           # need >=5 good landmarks for a trustworthy homography
MAX_REPROJ_ERR = 18.0    # px; above this the calibration is rejected for the frame

_model = None
_backend = None          # "ultralytics" (local .pt) | "roboflow" (inference)
_world = PITCH_VERTICES   # world landmarks matching the loaded model's keypoint order


def available():
    """True if a pitch model (local .pt OR Roboflow) is configured and loads."""
    try:
        load()
        return True
    except Exception as e:
        print("pitch calibration unavailable:", e, flush=True)
        return False


def load():
    """Two interchangeable backends, both run LOCALLY on the GPU at inference time:
      1) PITCH_MODEL_PATH -> a local YOLO-pose .pt via ultralytics (fully offline).
      2) else Roboflow `inference` (downloads weights once, then runs offline);
         needs ROBOFLOW_API_KEY. Uses sports' SoccerPitchConfiguration so the
         keypoint order is guaranteed to match.
    """
    global _model, _backend, _world
    if _model is not None:
        return _model
    path = os.getenv("PITCH_MODEL_PATH", "").strip()
    if path:
        if not os.path.exists(path):
            raise RuntimeError(f"pitch model not found: {path}")
        from ultralytics import YOLO
        _model = YOLO(path)
        _backend = "ultralytics"
        _world = PITCH_VERTICES
        print(f"pitch model (local): {path}", flush=True)
        return _model
    # Roboflow backend
    from inference import get_model
    mid = os.getenv("PITCH_MODEL_ID", "football-field-detection-v2/15")
    key = os.getenv("ROBOFLOW_API_KEY", "") or None
    _model = get_model(model_id=mid, api_key=key)
    _backend = "roboflow"
    try:
        from sports.configs.soccer import SoccerPitchConfiguration
        _world = [tuple(map(float, v)) for v in SoccerPitchConfiguration().vertices]
    except Exception:
        _world = PITCH_VERTICES
    print(f"pitch model (roboflow): {mid}", flush=True)
    return _model


def solve_homography(img_pts, world_pts):
    """RANSAC homography image px -> world cm, gated by reprojection error.

    img_pts / world_pts: matched (N,2) arrays. Returns 3x3 H or None.
    """
    import numpy as np
    import cv2
    img_pts = np.asarray(img_pts, dtype=np.float64)
    world_pts = np.asarray(world_pts, dtype=np.float64)
    if len(img_pts) < MIN_POINTS or len(img_pts) != len(world_pts):
        return None
    H, mask = cv2.findHomography(img_pts, world_pts, cv2.RANSAC, 8.0)
    if H is None:
        return None
    # quality gate: reproject world -> image with H^-1 and measure pixel error
    try:
        Hi = np.linalg.inv(H)
    except np.linalg.LinAlgError:
        return None
    inl = mask.ravel().astype(bool) if mask is not None else np.ones(len(img_pts), bool)
    if int(inl.sum()) < MIN_POINTS:
        return None
    wp = np.hstack([world_pts[inl], np.ones((int(inl.sum()), 1))])
    proj = (Hi @ wp.T).T
    proj = proj[:, :2] / proj[:, 2:3]
    err = float(np.sqrt(((proj - img_pts[inl]) ** 2).sum(axis=1)).mean())
    if err > MAX_REPROJ_ERR:
        return None
    return H


def homography(frame, min_conf=MIN_CONF):
    """Run the model on a frame; return (H, length_cm, width_cm) or None.

    H maps image pixels -> pitch centimetres.
    """
    import numpy as np
    model = load()
    if _backend == "roboflow":
        import supervision as sv
        result = model.infer(frame, confidence=0.3)[0]
        kp = sv.KeyPoints.from_inference(result)
        if kp.xy is None or len(kp.xy) == 0:
            return None
        xy = np.asarray(kp.xy[0])
        conf = np.asarray(kp.confidence[0]) if kp.confidence is not None else np.ones(len(xy))
    else:
        res = model.predict(frame, verbose=False)[0]
        kp = getattr(res, "keypoints", None)
        if kp is None or kp.xy is None or len(kp.xy) == 0:
            return None
        xy = kp.xy[0].cpu().numpy() if hasattr(kp.xy[0], "cpu") else np.asarray(kp.xy[0])
        if kp.conf is not None:
            conf = kp.conf[0].cpu().numpy() if hasattr(kp.conf[0], "cpu") else np.asarray(kp.conf[0])
        else:
            conf = np.ones(len(xy))
    n = min(len(xy), len(_world))
    img_pts, world_pts = [], []
    for i in range(n):
        if conf[i] >= min_conf and (xy[i][0] > 0 or xy[i][1] > 0):
            img_pts.append(xy[i])
            world_pts.append(_world[i])
    H = solve_homography(img_pts, world_pts)
    if H is None:
        return None
    return H, PITCH_LEN_CM, PITCH_WID_CM


def project(H, x_px, y_px):
    """Map one image pixel to pitch centimetres via homography H."""
    import numpy as np
    q = H @ np.array([x_px, y_px, 1.0], dtype=np.float64)
    if abs(q[2]) < 1e-9:
        return None
    return float(q[0] / q[2]), float(q[1] / q[2])


# --- pitch outline for the debug overlay (vertex-index edges + sampled circle) ---
_EDGES = [  # 1-based vertex pairs (see PITCH_VERTICES order)
    (1, 6), (6, 30), (30, 25), (25, 1),            # boundary
    (14, 17),                                       # halfway line
    (2, 10), (10, 13), (13, 5),                     # left penalty box
    (3, 7), (7, 8), (8, 4),                         # left goal box
    (26, 18), (18, 21), (21, 29),                   # right penalty box
    (27, 23), (23, 24), (24, 28),                   # right goal box
]


def draw_overlay(frame, H):
    """Reproject the pitch model onto the frame (BGR copy) for visual verification."""
    import numpy as np
    import cv2
    Hi = np.linalg.inv(H)

    def w2i(wx, wy):
        p = Hi @ np.array([wx, wy, 1.0])
        return int(p[0] / p[2]), int(p[1] / p[2])

    out = frame.copy()
    for a, b in _EDGES:
        pa = w2i(*PITCH_VERTICES[a - 1])
        pb = w2i(*PITCH_VERTICES[b - 1])
        cv2.line(out, pa, pb, (60, 230, 60), 2, cv2.LINE_AA)
    # centre circle, sampled in world space
    cx, cy = L / 2, Wd / 2
    pts = [w2i(cx + CCR * np.cos(t), cy + CCR * np.sin(t))
           for t in np.linspace(0, 2 * np.pi, 48)]
    cv2.polylines(out, [np.array(pts, dtype=np.int32)], True, (60, 230, 60), 2, cv2.LINE_AA)
    return out
