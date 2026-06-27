"""
Optional per-frame pitch calibration (automatic, no manual corners).

For each frame we run a pitch keypoint model (Roboflow `football-field-detection`
— a YOLOv8-pose model whose 32 keypoints correspond 1:1 to the vertices of
`sports.configs.soccer.SoccerPitchConfiguration`). The confident keypoints give
a homography image -> pitch (centimetres), so any image point (a player's feet)
maps to a real pitch coordinate in that frame, even as the broadcast camera pans.

This module loads lazily and raises if its deps / weights / network are missing,
so the worker can fall back to the manual 4-corner calibration. Install with:
    pip install inference "git+https://github.com/roboflow/sports.git"
and set ROBOFLOW_API_KEY (and optionally PITCH_MODEL_ID) in worker/.env.
"""
import os

_loaded = None   # (model, world_pts_cm[np.ndarray], length_cm, width_cm)


def available():
    try:
        load()
        return True
    except Exception as e:
        print("pitch calibration unavailable:", e, flush=True)
        return False


def load():
    global _loaded
    if _loaded is not None:
        return _loaded
    import numpy as np
    from inference import get_model
    from sports.configs.soccer import SoccerPitchConfiguration

    model_id = os.getenv("PITCH_MODEL_ID", "football-field-detection-v2/15")
    api_key = os.getenv("ROBOFLOW_API_KEY", "") or None
    model = get_model(model_id=model_id, api_key=api_key)
    cfg = SoccerPitchConfiguration()
    world = np.array(cfg.vertices, dtype=np.float32)   # (32,2) in centimetres
    _loaded = (model, world, float(cfg.length), float(cfg.width))
    print(f"pitch model {model_id} loaded ({len(world)} keypoints, "
          f"pitch {cfg.length/100:.0f}x{cfg.width/100:.0f} m)", flush=True)
    return _loaded


def homography(frame, min_conf=0.5):
    """Return (H, length_cm, width_cm) mapping image px -> pitch cm, or None."""
    import numpy as np
    import cv2
    import supervision as sv

    model, world, length, width = load()
    result = model.infer(frame, confidence=0.3)[0]
    kp = sv.KeyPoints.from_inference(result)
    if kp.xy is None or len(kp.xy) == 0:
        return None
    conf = kp.confidence[0]
    mask = conf > min_conf
    if int(mask.sum()) < 4:
        return None
    src = kp.xy[0][mask].astype(np.float32)
    dst = world[mask].astype(np.float32)
    H, _ = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)
    if H is None:
        return None
    return H, length, width


def project(H, x_px, y_px):
    """Map one image pixel to pitch centimetres via homography H."""
    import numpy as np
    p = np.array([x_px, y_px, 1.0], dtype=np.float64)
    q = H @ p
    if abs(q[2]) < 1e-9:
        return None
    return float(q[0] / q[2]), float(q[1] / q[2])
