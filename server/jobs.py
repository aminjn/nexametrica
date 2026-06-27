"""
Simple file-backed job store for the CV pipeline. Jobs are created by uploads
(or by the worker reporting a locally-processed video), claimed by the GPU
worker, and updated with results. Videos are stored under data/videos/.
"""
import json
import os
import threading
import time
import uuid

DATA = os.path.join(os.path.dirname(__file__), "data")
JOBS = os.path.join(DATA, "jobs.json")
VIDEOS = os.path.join(DATA, "videos")
_lock = threading.Lock()


def _read() -> list:
    try:
        with open(JOBS, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _write(j: list) -> None:
    os.makedirs(DATA, exist_ok=True)
    tmp = JOBS + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(j, f, ensure_ascii=False, indent=2)
    os.replace(tmp, JOBS)


def all_jobs() -> list:
    return sorted(_read(), key=lambda x: x.get("created", 0), reverse=True)


def get(jid: str):
    return next((x for x in _read() if x["id"] == jid), None)


def add(name: str, source: str = "upload", video_path: str = "") -> dict:
    with _lock:
        j = _read()
        job = {
            "id": uuid.uuid4().hex[:12],
            "name": name,
            "status": "queued",
            "created": int(time.time()),
            "source": source,
            "video_path": video_path,
            "result": None,
            "error": "",
        }
        j.append(job)
        _write(j)
        return job


def update(jid: str, **patch) -> dict | None:
    with _lock:
        j = _read()
        found = None
        for x in j:
            if x["id"] == jid:
                x.update(patch)
                found = x
        _write(j)
        return found


def delete(jid: str) -> bool:
    """Remove a job and its uploaded video file. Returns True if it existed."""
    with _lock:
        j = _read()
        victim = next((x for x in j if x["id"] == jid), None)
        if not victim:
            return False
        vp = victim.get("video_path")
        if vp:
            try:
                os.remove(vp if os.path.isabs(vp) else os.path.join(DATA, vp))
            except Exception:
                pass
        _write([x for x in j if x["id"] != jid])
        return True


def claim_next() -> dict | None:
    with _lock:
        j = _read()
        for x in j:
            if x["status"] == "queued":
                x["status"] = "processing"
                x["started"] = int(time.time())
                _write(j)
                return x
        return None
