"""
Generic persistent store for user-entered data (roster, schedule, training,
nutrition, scouting notes, …). Each "collection" is a key with arbitrary JSON
(usually a list). File-backed, same pattern as the rest of the project.
"""
import json
import os
import threading

DATA = os.path.join(os.path.dirname(__file__), "data")
PATH = os.path.join(DATA, "userdata.json")
_lock = threading.Lock()

# only allow known collections, so the endpoint can't be used as arbitrary storage
ALLOWED = {
    "roster", "schedule", "training", "nutrition", "scouting",
    "transfer", "clips", "sharing", "league", "integrations", "cloud",
}


def _read() -> dict:
    try:
        with open(PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def get(key: str):
    return _read().get(key)


def put(key: str, value) -> None:
    with _lock:
        d = _read()
        d[key] = value
        os.makedirs(DATA, exist_ok=True)
        tmp = PATH + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=2)
        os.replace(tmp, PATH)
