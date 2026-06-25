#!/usr/bin/env bash
# راه‌اندازی بک‌اند API نکسا متریکا روی سرور آروان (Ubuntu).
# کاملاً کپی‌-پیست: خودش ADMIN_TOKEN را می‌سازد و آخر کار چاپ می‌کند.
# کلید LLM را لازم نیست اینجا بگذاری؛ از پنل سوپر ادمین واردش می‌کنی.
#
#   cd ~/nexametrica && sudo bash server/setup-api.sh
set -euo pipefail

SERVER_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SERVER_DIR"

echo "▶ نصب Python و venv…"
apt-get install -y python3 python3-venv python3-pip openssl

echo "▶ ساخت محیط مجازی و نصب وابستگی‌ها…"
python3 -m venv .venv
.venv/bin/pip install --upgrade pip -q
.venv/bin/pip install -r requirements.txt -q

# .env را بساز و ADMIN_TOKEN را خودکار تولید کن (اگر خالی است)
[ -f .env ] || cp .env.example .env
if ! grep -qE '^ADMIN_TOKEN=.+' .env; then
  GEN_TOKEN="$(openssl rand -hex 24 2>/dev/null || head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n')"
  if grep -qE '^ADMIN_TOKEN=' .env; then
    sed -i "s|^ADMIN_TOKEN=.*|ADMIN_TOKEN=${GEN_TOKEN}|" .env
  else
    echo "ADMIN_TOKEN=${GEN_TOKEN}" >> .env
  fi
fi
ADMIN_TOKEN_VALUE="$(grep -E '^ADMIN_TOKEN=' .env | head -1 | cut -d= -f2-)"

echo "▶ ساخت سرویس systemd…"
cat > /etc/systemd/system/nexametrica-api.service <<UNIT
[Unit]
Description=Nexa Metrica API
After=network.target

[Service]
WorkingDirectory=$SERVER_DIR
EnvironmentFile=$SERVER_DIR/.env
ExecStart=$SERVER_DIR/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable nexametrica-api >/dev/null 2>&1 || true
systemctl restart nexametrica-api
sleep 1
systemctl --no-pager --lines=0 status nexametrica-api | head -4 || true

echo
echo "=================================================================="
echo "✅ API بالا آمد (http://127.0.0.1:8000)."
echo
echo "🔑 ADMIN_TOKEN شما (این را کپی کن):"
echo
echo "      ${ADMIN_TOKEN_VALUE}"
echo
echo "در سایت برو: سوپر ادمین → API هوش مصنوعی → این توکن را وارد کن،"
echo "بعد کلید و مدلِ LLM را بگذار و «تست اتصال» بزن."
echo "=================================================================="
echo "تست سلامت:  curl -s localhost:8000/api/health"
