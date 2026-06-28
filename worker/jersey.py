"""
Optional jersey-number OCR — fully local (EasyOCR), no API.

For a player's bounding box we crop the back/torso region, upscale it, and read
digits with EasyOCR (digit allowlist). Per track we collect confidence-weighted
votes across frames; the winning number identifies the player and drives Re-ID.

Gated by JERSEY=1 and loads lazily; raises if the dep/weights are missing so the
worker falls back to numberless Re-ID. Install once (on a machine with net):
    pip install easyocr
First use downloads ~64 MB of weights to ~/.EasyOCR, then it runs offline on GPU.
Works best on >=720p footage — at 360p shirt numbers are usually too small.
"""
import os

_reader = None
MIN_BOX_H = 30     # px; smaller player boxes can't carry a readable number


def available():
    if os.getenv("JERSEY", "0") in ("0", "false", "no", ""):
        return False
    try:
        load()
        return True
    except Exception as e:
        print("jersey OCR unavailable:", e, flush=True)
        return False


def load():
    global _reader
    if _reader is not None:
        return _reader
    import easyocr
    gpu = os.getenv("DEVICE", "0") != "cpu"
    _reader = easyocr.Reader(["en"], gpu=gpu, verbose=False)
    print("jersey OCR (easyocr) loaded", flush=True)
    return _reader


def read_number(frame, xyxy, min_conf=0.35):
    """Return a 1-2 digit jersey number string (and its confidence) or None."""
    import cv2
    reader = load()
    x1, y1, x2, y2 = [int(v) for v in xyxy]
    h, w = y2 - y1, x2 - x1
    if h < MIN_BOX_H or w < 18:
        return None
    # back/torso: upper-middle of the box, trimmed sideways to drop arms/background
    cy1, cy2 = y1 + int(0.15 * h), y1 + int(0.55 * h)
    cx1, cx2 = x1 + int(0.18 * w), x2 - int(0.18 * w)
    crop = frame[max(0, cy1):max(0, cy2), max(0, cx1):max(0, cx2)]
    if crop.size == 0:
        return None
    # preprocess: grayscale + CLAHE contrast + 3.4x upscale — helps small/blurry digits
    try:
        g = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        g = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8)).apply(g)
        g = cv2.resize(g, None, fx=3.4, fy=3.4, interpolation=cv2.INTER_CUBIC)
        res = reader.readtext(g, allowlist="0123456789", detail=1, paragraph=False)
    except Exception:
        return None
    best, best_c = None, 0.0
    for item in res:
        text, conf = item[1], float(item[2])
        digits = "".join(ch for ch in text if ch.isdigit())
        if digits and 1 <= len(digits) <= 2 and conf >= min_conf and conf > best_c:
            best, best_c = digits, conf
    return (best, best_c) if best else None
