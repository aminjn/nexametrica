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


API_BASE = _env("API_BASE", "https://nexametrica.ir/api").rstrip("/")
WORKER_TOKEN = _env("WORKER_TOKEN", "")
MODEL = _env("MODEL", "yolo11m.pt")
CONF = float(_env("CONF", "0.3"))
SAMPLE = int(_env("SAMPLE", "3"))      # process every Nth frame
IMGSZ = int(_env("IMGSZ", "1280"))
DEVICE = _env("DEVICE", "0")           # "0" for GPU, "cpu" otherwise
GRID_W, GRID_H = 32, 20
PITCH = _env("PITCH", "0") not in ("0", "false", "no", "")  # auto per-frame calibration (opt-in)
PITCH_EVERY = int(_env("PITCH_EVERY", "2"))   # run pitch model every Nth processed frame
JERSEY = _env("JERSEY", "0") not in ("0", "false", "no", "")  # jersey-number OCR (opt-in)
JERSEY_EVERY = int(_env("JERSEY_EVERY", "3")) # run OCR every Nth processed frame
PGRID_W, PGRID_H = 52, 34               # pitch-space heatmap (~2 m cells over 105x68)

PERSON, BALL = 0, 32  # COCO class ids

_model = None


def _headers():
    return {"X-Worker-Token": WORKER_TOKEN} if WORKER_TOKEN else {}


def _host():
    # API_BASE ends with /api; strip it to build absolute video URLs
    return API_BASE[:-4] if API_BASE.endswith("/api") else API_BASE


def _jsonable(o):
    # Convert numpy scalars/arrays to plain Python so json can serialize.
    if isinstance(o, dict):
        return {k: _jsonable(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [_jsonable(x) for x in o]
    if hasattr(o, "tolist"):  # numpy array
        return o.tolist()
    if hasattr(o, "item"):    # numpy scalar
        try:
            return o.item()
        except Exception:
            return o
    return o


def get_model():
    global _model
    if _model is None:
        from ultralytics import YOLO
        print(f"loading model {MODEL} on device {DEVICE} …", flush=True)
        _model = YOLO(MODEL)
    return _model


def _jersey_lab(frame, xyxy):
    """Median Lab colour of a player's torso, excluding green pitch / dark pixels."""
    import cv2
    import numpy as np
    x1, y1, x2, y2 = [int(v) for v in xyxy]
    h, w = y2 - y1, x2 - x1
    if h < 10 or w < 8:
        return None
    ty1, ty2 = y1 + int(0.18 * h), y1 + int(0.5 * h)
    tx1, tx2 = x1 + int(0.2 * w), x2 - int(0.2 * w)
    crop = frame[max(0, ty1):max(0, ty2), max(0, tx1):max(0, tx2)]
    if crop.size == 0:
        return None
    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
    hue, sat, val = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    keep = ~(((hue >= 35) & (hue <= 85) & (sat > 40)) | (val < 35))
    pix = crop[keep]
    if pix.shape[0] < 12:
        pix = crop.reshape(-1, 3)
    lab = cv2.cvtColor(pix.reshape(-1, 1, 3), cv2.COLOR_BGR2LAB).reshape(-1, 3)
    return np.median(lab, axis=0).astype(np.float32)


def _lab_to_hex(c):
    import cv2
    import numpy as np
    px = np.array([[c]], dtype=np.uint8)
    r, g, b = cv2.cvtColor(px, cv2.COLOR_LAB2RGB)[0, 0]
    return "#%02x%02x%02x" % (int(r), int(g), int(b))


def process_video(path: str, progress=None) -> dict:
    import cv2
    import numpy as np
    import supervision as sv
    from collections import defaultdict

    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise RuntimeError(f"cannot open video: {path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
    H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)

    tracker = sv.ByteTrack(frame_rate=int(round(fps)))
    heat = np.zeros((GRID_H, GRID_W), dtype=np.int64)
    track_heat = defaultdict(lambda: np.zeros((GRID_H, GRID_W), dtype=np.int64))
    track_cols = defaultdict(list)
    track_pts = defaultdict(list)      # per-track normalized image points (for calibration)
    ball_pts, track_ids, players_per = [], set(), []
    poss_by_tid = defaultdict(int)     # track -> frames it held the ball
    owner_seq = []                     # (t_sec, owner_tid) at each ball-owned frame
    ball_count, frames, idx = 0, 0, -1
    # Keep the best "wide tactical" frame per time-segment, so the UI can offer
    # several clean candidates from different moments (not one auto-pick that may
    # land on a VAR replay / closeup).
    KF_SEGMENTS = 6
    seg_best = {}               # seg -> (score, frame_copy)
    fallback_img = None
    m = get_model()

    # ---- automatic per-frame pitch calibration (optional) ----
    pitch_ok = False
    cur_H = None
    pitch_len = pitch_wid = None
    calib_check = None          # one frame with the pitch reprojected, for visual proof
    pitch_attempts = pitch_hits = 0
    track_xy_m = defaultdict(list)   # track -> [(t_sec, x_m, y_m)] in real pitch metres
    pheat = np.zeros((PGRID_H, PGRID_W), dtype=np.int64)
    pheat_t = [np.zeros((PGRID_H, PGRID_W), dtype=np.int64),
               np.zeros((PGRID_H, PGRID_W), dtype=np.int64)]
    if PITCH:
        try:
            import pitch as pitch_mod
            pitch_ok = pitch_mod.available()
        except Exception as e:
            print("pitch import failed:", e, flush=True)
            pitch_ok = False

    # ---- optional jersey-number OCR ----
    jersey_ok = False
    track_nums = defaultdict(lambda: defaultdict(float))   # track -> {number: cum_conf}
    if JERSEY:
        try:
            import jersey as jersey_mod
            jersey_ok = jersey_mod.available()
        except Exception as e:
            print("jersey import failed:", e, flush=True)
            jersey_ok = False

    while True:
        if not cap.grab():
            break
        idx += 1
        if idx % SAMPLE != 0:
            continue
        ok, frame = cap.retrieve()
        if not ok:
            break
        t_sec = idx / fps if fps else 0.0
        if pitch_ok and frames % PITCH_EVERY == 0:
            pitch_attempts += 1
            try:
                hh = pitch_mod.homography(frame)
                if hh is not None:
                    cur_H, pitch_len, pitch_wid = hh
                    pitch_hits += 1
                    if calib_check is None:
                        try:
                            calib_check = pitch_mod.draw_overlay(frame, cur_H)
                        except Exception:
                            pass
            except Exception as e:
                if pitch_attempts <= 1:
                    print("pitch homography error:", e, flush=True)
        res = m.predict(
            frame, classes=[PERSON, BALL], conf=CONF, imgsz=IMGSZ,
            device=DEVICE, verbose=False,
        )[0]
        det = sv.Detections.from_ultralytics(res)
        players = det[det.class_id == PERSON]
        balls = det[det.class_id == BALL]

        tracked = tracker.update_with_detections(players)
        n = 0
        nx_list, ny_list, bh_list = [], [], []
        frame_players = []          # (cx, cy, tid) this frame, for ball possession
        for xyxy, tid in zip(tracked.xyxy, tracked.tracker_id):
            n += 1
            cx = (xyxy[0] + xyxy[2]) / 2.0
            cy = (xyxy[1] + xyxy[3]) / 2.0
            nx_list.append(cx / max(1, W))
            ny_list.append(cy / max(1, H))
            bh_list.append((xyxy[3] - xyxy[1]) / max(1, H))
            gx = min(GRID_W - 1, max(0, int(cx / max(1, W) * GRID_W)))
            gy = min(GRID_H - 1, max(0, int(cy / max(1, H) * GRID_H)))
            heat[gy, gx] += 1
            if tid is not None:
                ti = int(tid)
                track_ids.add(ti)
                frame_players.append((cx, cy, ti))
                track_heat[ti][gy, gx] += 1
                if len(track_pts[ti]) < 80:
                    track_pts[ti].append([round(float(cx) / max(1, W), 4), round(float(cy) / max(1, H), 4)])
                if len(track_cols[ti]) < 25:
                    col = _jersey_lab(frame, xyxy)
                    if col is not None:
                        track_cols[ti].append(col)
                # jersey number OCR — vote per track until confident enough
                if jersey_ok and frames % JERSEY_EVERY == 0 and sum(track_nums[ti].values()) < 8:
                    rn = jersey_mod.read_number(frame, xyxy)
                    if rn is not None:
                        track_nums[ti][rn[0]] += rn[1]
                # real pitch position from the feet (bottom-centre of the box)
                if cur_H is not None:
                    pm = pitch_mod.project(cur_H, float(cx), float(xyxy[3]))
                    if pm is not None:
                        xm, ym = pm[0] / 100.0, pm[1] / 100.0   # cm -> m
                        if -5 <= xm <= (pitch_len or 12000) / 100 + 5 and -5 <= ym <= (pitch_wid or 7000) / 100 + 5:
                            track_xy_m[ti].append((t_sec, xm, ym))
        players_per.append(n)

        # Score this frame as a calibration keyframe candidate. A wide tactical
        # pitch view has MANY players, SPREAD across the frame, with SMALL boxes
        # (players are far away). VAR replays / closeups have few, large, clustered
        # boxes — so they score low and won't be chosen.
        if n >= 6:
            spread = float(np.std(nx_list) + np.std(ny_list))
            med_bh = float(np.median(bh_list)) or 1e-3
            score = n * spread / med_bh
            if total > 0:
                seg = min(KF_SEGMENTS - 1, int(idx / total * KF_SEGMENTS))
            else:
                seg = (frames // 60) % KF_SEGMENTS
            if seg not in seg_best or score > seg_best[seg][0]:
                seg_best[seg] = (score, frame.copy())
        elif fallback_img is None:
            fallback_img = frame.copy()  # tiny/odd clips that never reach 6 players

        for xyxy in balls.xyxy:
            ball_count += 1
            bxp = (xyxy[0] + xyxy[2]) / 2.0
            byp = (xyxy[1] + xyxy[3]) / 2.0
            ball_pts.append([round(float(bxp) / max(1, W), 3), round(float(byp) / max(1, H), 3)])
            # possession: nearest player within reach owns the ball this frame
            owner, od = None, 1e18
            for (px, py, ti) in frame_players:
                d = (px - bxp) ** 2 + (py - byp) ** 2
                if d < od:
                    od, owner = d, ti
            if owner is not None and od ** 0.5 < 0.06 * max(W, H):
                poss_by_tid[owner] += 1
                if not owner_seq or owner_seq[-1][1] != owner:
                    owner_seq.append((t_sec, owner))

        frames += 1
        if progress and frames % 30 == 0:
            progress(idx, total)

    cap.release()
    dur = (total / fps) if total else 0
    if PITCH:
        print(f"pitch calibration: {pitch_hits}/{pitch_attempts} frames calibrated, "
              f"{len(track_xy_m)} tracks with real positions", flush=True)

    # ---- team separation by jersey colour (KMeans on per-track median Lab) ----
    # If the two colour clusters are too close, it's a single kit (e.g. a training
    # session) — don't fake an A/B split.
    TEAM_SPLIT_MIN = 26.0   # min Lab distance between the two kit colours
    teams = None
    heat_a = heat_b = None
    single_team = False
    tid2team = {}
    try:
        tids = [t for t in track_cols if len(track_cols[t]) >= 2]
        if len(tids) >= 2:
            feats = np.array([np.mean(track_cols[t], axis=0) for t in tids], dtype=np.float32)
            crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
            _, labels, centers = cv2.kmeans(feats, 2, None, crit, 6, cv2.KMEANS_PP_CENTERS)
            labels = labels.flatten()
            sep = float(np.linalg.norm(centers[0] - centers[1]))
            print(f"team colour separation: {sep:.1f} (single-team if < {TEAM_SPLIT_MIN})", flush=True)
            if sep < TEAM_SPLIT_MIN:
                # one kit → single group, no A/B
                single_team = True
                tid2team = {t: 0 for t in tids}
                th0 = np.zeros((GRID_H, GRID_W), dtype=np.int64)
                for t in tids:
                    th0 += track_heat[t]
                teams = [{"color": _lab_to_hex(np.mean(centers, axis=0)),
                          "tracks": len(tids),
                          "players_avg": round(sum(int(track_heat[t].sum()) for t in tids) / max(1, frames), 1)}]
                heat_a, heat_b = th0.tolist(), None
            else:
                tid2team = {t: int(lb) for t, lb in zip(tids, labels)}
                th = [np.zeros((GRID_H, GRID_W), dtype=np.int64), np.zeros((GRID_H, GRID_W), dtype=np.int64)]
                det_per = [0, 0]
                for t, lb in zip(tids, labels):
                    th[lb] += track_heat[t]
                    det_per[lb] += int(track_heat[t].sum())
                teams = [
                    {
                        "color": _lab_to_hex(centers[k]),
                        "tracks": int((labels == k).sum()),
                        "players_avg": round(det_per[k] / max(1, frames), 1),
                    }
                    for k in range(2)
                ]
                heat_a, heat_b = th[0].tolist(), th[1].tolist()
    except Exception:
        teams = None

    # ---- ball possession by team (nearest player to the ball) ----
    possession = None
    if not single_team and tid2team:
        pa = sum(c for t, c in poss_by_tid.items() if tid2team.get(t) == 0)
        pb = sum(c for t, c in poss_by_tid.items() if tid2team.get(t) == 1)
        tot = pa + pb
        if tot >= 20:    # need enough ball-frames to be meaningful
            possession = {"a": round(100 * pa / tot), "b": round(100 * pb / tot), "frames": tot}
            print(f"possession: A {possession['a']}% / B {possession['b']}% ({tot} ball-frames)", flush=True)

    # ---- real-pitch heatmaps + physical analytics (from auto calibration) ----
    physical = None
    pitch_heat = pitch_heat_a = pitch_heat_b = None
    if pitch_ok and track_xy_m:
        try:
            import physics
            plen = (pitch_len or 12000) / 100.0   # metres
            pwid = (pitch_wid or 7000) / 100.0
            for tid, series in track_xy_m.items():
                lb = tid2team.get(tid, -1)
                for (_t, xm, ym) in series:
                    gx = min(PGRID_W - 1, max(0, int(xm / max(1e-3, plen) * PGRID_W)))
                    gy = min(PGRID_H - 1, max(0, int(ym / max(1e-3, pwid) * PGRID_H)))
                    pheat[gy, gx] += 1
                    if lb in (0, 1):
                        pheat_t[lb][gy, gx] += 1
            pitch_heat = pheat.tolist()
            pitch_heat_a = pheat_t[0].tolist()
            pitch_heat_b = None if single_team else pheat_t[1].tolist()
            # resolve a jersey number per track (confidence-weighted majority vote)
            track_number = {}
            for ti, votes in track_nums.items():
                if votes:
                    num, score = max(votes.items(), key=lambda kv: kv[1])
                    if score >= 1.5:
                        track_number[ti] = num
            # Re-ID: stitch fragmented tracks into players, then per-player stats.
            import reid
            tracklets = []
            for tid, series in track_xy_m.items():
                col = None
                if track_cols.get(tid):
                    col = [float(c) for c in np.mean(track_cols[tid], axis=0)]
                tracklets.append({"id": int(tid), "team": tid2team.get(tid, -1),
                                  "color": col, "number": track_number.get(tid),
                                  "points": list(series)})
            players = reid.stitch(tracklets)
            physical = physics.summarise_players(players)
            physical["pitch_m"] = [round(plen, 1), round(pwid, 1)]
            physical["raw_tracks"] = len(track_xy_m)
            physical["numbered"] = len(track_number)
            print(f"re-id: {len(track_xy_m)} tracks -> {physical['player_count']} players "
                  f"({len(track_number)} with jersey numbers)", flush=True)

            # ---- pass detection + passing network (from the ball-owner sequence) ----
            try:
                track2player = {}
                node_info = {}      # player_id -> {team, number, sx, sy, label}
                for p in players:
                    pid = p["player"]
                    for tid in p.get("members", []):
                        track2player[tid] = pid
                    pts = p.get("points") or []
                    if pts:
                        sx = sum(q[1] for q in pts) / len(pts) / max(1e-3, plen)
                        sy = sum(q[2] for q in pts) / len(pts) / max(1e-3, pwid)
                        node_info[pid] = {"team": int(p["team"]), "number": p.get("number"),
                                          "x": round(min(1, max(0, sx)), 3),
                                          "y": round(min(1, max(0, sy)), 3)}
                # collapse owner sequence into possession segments, detect transfers
                segs = []
                for (t, o) in owner_seq:
                    if segs and segs[-1] == o:
                        continue
                    segs.append(o)
                pass_ct = [0, 0]
                edges = defaultdict(int)
                for o0, o1 in zip(segs, segs[1:]):
                    t0, t1 = tid2team.get(o0, -1), tid2team.get(o1, -1)
                    if o0 != o1 and t0 == t1 and t0 in (0, 1):
                        pa, pb = track2player.get(o0), track2player.get(o1)
                        if pa and pb and pa != pb:
                            edges[(pa, pb)] += 1
                        pass_ct[t0] += 1
                net_nodes = [{"id": pid, **info} for pid, info in node_info.items()]
                net_edges = [{"from": a, "to": b, "count": c, "team": node_info.get(a, {}).get("team", -1)}
                             for (a, b), c in edges.items() if c >= 1]
                net_edges.sort(key=lambda e: -e["count"])
                physical["passes"] = {"a": pass_ct[0], "b": pass_ct[1],
                                      "total": pass_ct[0] + pass_ct[1],
                                      "nodes": net_nodes, "edges": net_edges[:120]}
                print(f"passes: A {pass_ct[0]} / B {pass_ct[1]}, {len(net_edges)} network links", flush=True)
            except Exception as e:
                print("pass detection failed:", e, flush=True)
        except Exception as e:
            print("physics failed:", e, flush=True)
            physical = None

    # ---- calibration payload: keyframe + team-tagged player points (image space) ----
    points = []
    for tid, plist in track_pts.items():
        tm = tid2team.get(tid, -1)
        for p in plist:
            points.append([p[0], p[1], tm])
    if len(points) > 6000:
        step = max(1, len(points) // 6000)
        points = points[::step][:6000]

    def _encode_kf(img):
        import base64
        h0, w0 = img.shape[:2]
        sc = 480.0 / max(1, w0)
        small = cv2.resize(img, (int(w0 * sc), int(h0 * sc)))
        okj, buf = cv2.imencode(".jpg", small, [int(cv2.IMWRITE_JPEG_QUALITY), 65])
        if not okj:
            return None
        return "data:image/jpeg;base64," + base64.b64encode(buf.tobytes()).decode()

    # candidate keyframes: best wide-view frame per time segment, time-ordered,
    # so the operator can pick a clean one (and skip any VAR/closeup that slips in).
    keyframes = []
    try:
        for seg in sorted(seg_best):
            url = _encode_kf(seg_best[seg][1])
            if url:
                keyframes.append(url)
        if not keyframes and fallback_img is not None:
            url = _encode_kf(fallback_img)
            if url:
                keyframes.append(url)
    except Exception:
        keyframes = []
    keyframe = keyframes[0] if keyframes else None  # best single (back-compat)

    calibration_check = None
    if calib_check is not None:
        try:
            calibration_check = _encode_kf(calib_check)
        except Exception:
            calibration_check = None

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
        "heatmap_a": heat_a,
        "heatmap_b": heat_b,
        "teams": teams,
        "single_team": single_team,
        "possession": possession,
        "grid": {"w": GRID_W, "h": GRID_H},
        "points": points,
        "keyframe": keyframe,
        "keyframes": keyframes,
        "calibration_auto": bool(pitch_ok and physical),
        "calibration_check": calibration_check,
        "pitch_heatmap": pitch_heat,
        "pitch_heatmap_a": pitch_heat_a,
        "pitch_heatmap_b": pitch_heat_b,
        "physical": physical,
        "model": MODEL,
    }


def post_result(jid, result, status="done", error=""):
    httpx.post(f"{API_BASE}/worker/result/{jid}", headers=_headers(),
               json={"status": status, "result": _jsonable(result), "error": error}, timeout=120)


def create_job(name, result):
    r = httpx.post(f"{API_BASE}/worker/job", headers=_headers(),
                   json={"name": name, "status": "done", "result": _jsonable(result)}, timeout=120)
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
