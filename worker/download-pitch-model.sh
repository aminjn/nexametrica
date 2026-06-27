#!/usr/bin/env bash
# Download the pitch-keypoint model ONCE (no account, no API, just a file).
# After this, the worker runs 100% locally/offline — zero external calls at run time.
#
# Model: martinjolif/yolo-football-pitch-detection (YOLOv8x-pose, 32 pitch keypoints,
#        loadable directly with ultralytics). Saved to worker/models/pitch.pt.
#
#   cd ~/nexametrica/worker && bash download-pitch-model.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p models
OUT="models/pitch.pt"

if [ -f "$OUT" ]; then
  echo "✓ مدل از قبل هست: $OUT"
  exit 0
fi

BASE="https://huggingface.co/martinjolif/yolo-football-pitch-detection/resolve/main"
# نامِ فایل ممکن است یکی از این‌ها باشد؛ اولی که موجود بود را می‌گیریم.
CANDS="yolo-football-pitch-detection.pt best.pt model.pt weights.pt"

dl() { command -v wget >/dev/null 2>&1 && wget -q --show-progress -O "$2" "$1" || curl -fL -o "$2" "$1"; }

for f in $CANDS; do
  echo "▶ تلاش برای دانلود: $f"
  if dl "$BASE/$f?download=true" "$OUT"; then
    # فایلِ معتبر باید چند مگابایت باشد (نه صفحه‌ی خطای HTML)
    sz=$(stat -c%s "$OUT" 2>/dev/null || echo 0)
    if [ "$sz" -gt 1000000 ]; then
      echo "✅ دانلود شد → $OUT ($((sz/1024/1024)) MB)"
      exit 0
    fi
  fi
  rm -f "$OUT"
done

echo "✗ هیچ‌کدام از نام‌ها جواب نداد. به صفحه‌ی Files مدل سر بزن و نامِ دقیقِ فایلِ .pt را بردار:"
echo "  https://huggingface.co/martinjolif/yolo-football-pitch-detection/tree/main"
echo "سپس:  wget -O $OUT '$BASE/<نامِ-دقیق>.pt?download=true'"
exit 1
