"""
One-time downloader for the pitch-keypoint model — run on ANY machine that has
internet (your laptop, a phone hotspot, with a VPN if needed). It does NOT need
to run on the Z440. After it finishes, copy the produced .pt to the Z440 (USB or
LAN) and set PITCH_MODEL_PATH to it. From then on the worker is fully offline.

The model must be a YOLO-pose model whose 32 keypoints follow the standard
SoccerPitchConfiguration order used in pitch.py (PITCH_VERTICES).

Usage:
    # easiest — a public Ultralytics-format .pt URL or local path:
    python3 get_pitch_model.py --url  https://example/pitch-keypoints.pt
    python3 get_pitch_model.py --file ./pitch-keypoints.pt

    # or via Roboflow (needs a free key, only on THIS internet machine):
    ROBOFLOW_API_KEY=xxx python3 get_pitch_model.py --roboflow football-field-detection-v2/15

Output: ./pitch.pt  (copy this to the Z440)
"""
import argparse
import shutil
import sys

OUT = "pitch.pt"


def from_url(url):
    import urllib.request
    print(f"downloading {url} -> {OUT}")
    urllib.request.urlretrieve(url, OUT)


def from_file(path):
    print(f"copying {path} -> {OUT}")
    shutil.copyfile(path, OUT)


def from_roboflow(model_id):
    # Downloads weights via Roboflow on THIS internet-connected machine, then
    # exports an Ultralytics-loadable .pt. Requires: pip install inference
    import os
    os.environ.setdefault("ONNXRUNTIME_EXECUTION_PROVIDERS", "[CPUExecutionProvider]")
    from inference import get_model
    key = os.getenv("ROBOFLOW_API_KEY")
    if not key:
        sys.exit("set ROBOFLOW_API_KEY (free at roboflow.com) for --roboflow")
    print(f"fetching {model_id} via Roboflow …")
    m = get_model(model_id=model_id, api_key=key)
    # locate the cached weights the SDK just downloaded
    import glob
    cands = glob.glob(os.path.expanduser("~/.inference/**/*.pt"), recursive=True)
    cands += glob.glob("/tmp/cache/**/*.pt", recursive=True)
    if not cands:
        sys.exit("could not locate cached .pt — use --file with the weights path instead")
    newest = max(cands, key=os.path.getmtime)
    print(f"found cached weights: {newest}")
    shutil.copyfile(newest, OUT)


def verify():
    try:
        from ultralytics import YOLO
        m = YOLO(OUT)
        print("loaded OK with ultralytics. task:", getattr(m, "task", "?"))
        kpts = getattr(getattr(m, "model", None), "kpt_shape", None)
        if kpts:
            print("keypoints:", kpts, "(should be 32)")
    except Exception as e:
        print("⚠ could not verify with ultralytics:", e)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--url")
    g.add_argument("--file")
    g.add_argument("--roboflow")
    a = ap.parse_args()
    if a.url:
        from_url(a.url)
    elif a.file:
        from_file(a.file)
    else:
        from_roboflow(a.roboflow)
    verify()
    print(f"\n✅ done → {OUT}\nCopy it to the Z440 and set in worker/.env:\n  PITCH=1\n  PITCH_MODEL_PATH=/absolute/path/to/{OUT}")
