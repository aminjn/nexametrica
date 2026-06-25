"""
Tiny persistent settings store (JSON file). Holds admin-editable config such as
the LLM provider/key/model so it can be managed from the Super Admin panel
instead of editing .env. The file lives outside git (server/data/).
"""
import json
import os
import threading

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
SETTINGS_PATH = os.path.join(DATA_DIR, "settings.json")
_lock = threading.Lock()


def _read() -> dict:
    try:
        with open(SETTINGS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def get_settings() -> dict:
    return _read()


def save_settings(patch: dict) -> dict:
    with _lock:
        cur = _read()
        for k, v in patch.items():
            if v is not None:
                cur[k] = v
        os.makedirs(DATA_DIR, exist_ok=True)
        tmp = SETTINGS_PATH + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(cur, f, ensure_ascii=False, indent=2)
        os.replace(tmp, SETTINGS_PATH)
        return cur
