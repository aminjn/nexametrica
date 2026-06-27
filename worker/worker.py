"""
Nexa Metrica GPU worker (runs on the Z440 / RTX 3070).

Detects players (COCO `person`) and the ball (`sports ball`) with YOLO11 and
tracks players with ByteTrack — no training needed. Produces tracking-derived
stats (player counts, unique tracks, an occupancy heatmap, ball trajectory) and
posts them back to the API.

Modes:
  process <video>   process a LOCAL file and report a finished job
  serve             poll the API queue, download each video, process, post back

Config via env / worker/.env (see .env.example).
"""
import json
import os
import re
import sys
import tempfile
import time

import httpx


def _env(key: str, default: str) -> str:
    # Tolerate inline comments (systemd EnvironmentFile keeps "0.3  # note").
    v = os.getenv(key, default)
    v = re.sub(r"\s+#.*$", "", v)
    return v.strip()


API_BASE = _env("API_BASE", "https://mt.nexxaai.ir/api").rstrip("/")
WORKER_TOKEN = _env("WORKER_TOKEN", "")
MODEL = _env("MODEL", "yolo11m.pt")
CONF = float(_env("CONF", "0.3"))
SAMPLE = int(_env("SAMPLE", "3"))      # process every Nth frame
IMGSZ = int(_env("IMGSZ", "1280"))
DEVICE = _env("DEVICE", "0")           # "0" for GPU, "cpu" otherwise
GRID_W, GRID_H = 16, 10

PERSON, BALL = 0, 32  # COCO class ids

_model = None


def _headers():
    return {"X-Worker-Token": WORKER_TOKEN} if WORKER_TOKEN else {}


def _host():
    # API_BASE ends with /api; strip it to build absolute video URLs
    return API_BASE[:-4] if API_BASE.endswith("/api") else API_BASE


def get_model():
    global _model
    if _model is None:
        from ultralytics import YOLO
        print(f"loading model {MODEL} on device {DEVICE} …", flush=True)
        _model = YOLO(MODEL)
    return _model


def process_video(path: str, progress=None) -> dict:
    import cv2
    import numpy as np
    import supervision as sv

    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise RuntimeError(f"cannot open video: {path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
    H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)

    tracker = sv.ByteTrack(frame_rate=int(round(fps)))
    heat = np.zeros((GRID_H, GRID_W), dtype=np.int64)
    ball_pts, track_ids, players_per = [], set(), []
    ball_count, frames, idx = 0, 0, -1
    m = get_model()

    while True:
        if not cap.grab():
            break
        idx += 1
        if idx % SAMPLE != 0:
            continue
        ok, frame = cap.retrieve()
        if not ok:
            break
        res = m.predict(
            frame, classes=[PERSON, BALL], conf=CONF, imgsz=IMGSZ,
            device=DEVICE, verbose=False,
        )[0]
        det = sv.Detections.from_ultralytics(res)
        players = det[det.class_id == PERSON]
        balls = det[det.class_id == BALL]

        tracked = tracker.update_with_detections(players)
        n = 0
        for xyxy, tid in zip(tracked.xyxy, tracked.tracker_id):
            n += 1
            if tid is not None:
                track_ids.add(int(tid))
            cx = (xyxy[0] + xyxy[2]) / 2.0
            cy = (xyxy[1] + xyxy[3]) / 2.0
            gx = min(GRID_W - 1, max(0, int(cx / max(1, W) * GRID_W)))
            gy = min(GRID_H - 1, max(0, int(cy / max(1, H) * GRID_H)))
            heat[gy, gx] += 1
        players_per.append(n)

        for xyxy in balls.xyxy:
            ball_count += 1
            bx = (xyxy[0] + xyxy[2]) / 2.0 / max(1, W)
            by = (xyxy[1] + xyxy[3]) / 2.0 / max(1, H)
            ball_pts.append([round(float(bx), 3), round(float(by), 3)])

        frames += 1
        if progress and frames % 30 == 0:
            progress(idx, total)

    cap.release()
    dur = (total / fps) if total else 0
    return {
        "video": {"width": W, "height": H, "fps": round(float(fps), 2),
                  "frames_total": total, "duration_sec": round(dur, 1)},
        "processed_frames": frames,
        "players": {
            "avg": round(sum(players_per) / len(players_per), 1) if players_per else 0,
            "max": max(players_per) if players_per else 0,
            "unique_tracks": len(track_ids),
        },
        "ball": {"detections": ball_count, "trajectory": ball_pts[:2000]},
        "heatmap": heat.tolist(),
        "grid": {"w": GRID_W, "h": GRID_H},
        "model": MODEL,
    }


def post_result(jid, result, status="done", error=""):
    httpx.post(f"{API_BASE}/worker/result/{jid}", headers=_headers(),
               json={"status": status, "result": result, "error": error}, timeout=120)


def create_job(name, result):
    r = httpx.post(f"{API_BASE}/worker/job", headers=_headers(),
                   json={"name": name, "status": "done", "result": result}, timeout=120)
    r.raise_for_status()
    return r.json().get("id")


def cmd_process(path):
    print(f"processing local file: {path}", flush=True)
    res = process_video(path, progress=lambda i, t: print(f"  frame {i}/{t}", flush=True))
    jid = create_job(os.path.basename(path), res)
    print("done → job", jid)
    print(json.dumps({"players": res["players"], "ball": res["ball"]["detections"]}, ensure_ascii=False))


def cmd_serve():
    print(f"worker serving against {API_BASE} (model={MODEL}, device={DEVICE})", flush=True)
    while True:
        try:
            r = httpx.get(f"{API_BASE}/worker/next", headers=_headers(), timeout=30)
            job = r.json().get("job")
        except Exception as e:
            print("poll error:", e, flush=True)
            time.sleep(5)
            continue
        if not job:
            time.sleep(5)
            continue
        jid = job["id"]
        url = _host() + job["video_url"] if job["video_url"].startswith("/") else job["video_url"]
        print(f"got job {jid}: {job['name']}", flush=True)
        try:
            with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tf:
                with httpx.stream("GET", url, headers=_headers(), timeout=None) as s:
                    for chunk in s.iter_bytes():
                        tf.write(chunk)
                tmp = tf.name
            res = process_video(tmp)
            post_result(jid, res, "done")
            os.unlink(tmp)
            print("  → done", flush=True)
        except Exception as e:
            post_result(jid, None, "failed", str(e))
            print("  → failed:", e, flush=True)


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "process":
        cmd_process(sys.argv[2])
    elif len(sys.argv) >= 2 and sys.argv[1] == "serve":
        cmd_serve()
    else:
        print("usage: python worker.py process <video> | serve")
        sys.exit(1)
