#!/usr/bin/env bash
# نصب workerِ بینایی ماشین روی Z440 (Ubuntu + NVIDIA driver نصب‌شده).
# پیش‌نیاز: درایور انویدیا نصب باشد (تستِ سریع: nvidia-smi).
#
#   cd ~/nexametrica/worker && bash setup-worker.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "▶ پیش‌نیازها…"
# توجه: ممکن است یک مخزنِ شخص‌ثالث (مثل NVIDIA CUDA) از ایران بلاک باشد و
# apt-get update خطا بدهد؛ مهم نیست چون تورچ را با pip نصب می‌کنیم. پس ادامه بده.
sudo apt-get update -y || true
# libgl1/libglib برای import cv2 روی سرورِ بدون‌نمایشگر لازم‌اند
sudo apt-get install -y python3 python3-venv python3-pip ffmpeg libgl1 libglib2.0-0

python3 -m venv .venv
.venv/bin/pip install --upgrade pip -q

echo "▶ نصب PyTorch با CUDA 12.1 (مناسب RTX 3070)…"
# اگر CUDA در دسترس نشد، نسخه‌ی cu118 را امتحان کن:
#   .venv/bin/pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
.venv/bin/pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

echo "▶ نصب کتابخانه‌های بینایی ماشین (ultralytics/supervision/opencv)…"
.venv/bin/pip install -r requirements.txt
# کالیبراسیونِ خودکارِ زمین به چیزِ اضافه‌ای نیاز ندارد — فقط همین ultralytics و یک
# فایلِ مدلِ محلی. هیچ API ای، نه موقعِ اجرا و نه حتی یک‌بار.

echo "▶ دانلودِ یک‌باره‌ی مدلِ زمین (فقط یک فایل، بدونِ هیچ API/اکانت)…"
bash download-pitch-model.sh || echo "⚠ مدلِ زمین دانلود نشد — بعداً دستی: bash download-pitch-model.sh"

[ -f .env ] || cp .env.example .env

echo "▶ تست GPU:"
.venv/bin/python - <<'PY'
import torch
print("torch:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
PY

echo
echo "=================================================================="
echo "✅ نصب شد."
echo "۱) فایل worker/.env را تنظیم کن (مخصوصاً API_BASE)."
echo "۲) تستِ یک ویدیوی محلی:"
echo "     .venv/bin/python worker.py process /path/to/match.mp4"
echo "۳) حالتِ سرویس (پردازشِ صفِ آپلودها از سایت):"
echo "     .venv/bin/python worker.py serve"
echo "   (برای اجرای دائمی، از systemd استفاده کن — راهنما در worker/README.md)"
echo "=================================================================="
