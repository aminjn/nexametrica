#!/usr/bin/env bash
# راه‌اندازی بک‌اند API نکسا متریکا روی سرور آروان (Ubuntu).
# قبل از اجرا: server/.env را از روی .env.example بساز و کلید LLM را بگذار.
#
#   cd ~/nexametrica/server
#   cp .env.example .env && nano .env        # LLM_API_KEY و LLM_BASE_URL را بگذار
#   sudo bash setup-api.sh
set -euo pipefail

SERVER_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SERVER_DIR"

echo "▶ نصب Python و venv…"
apt-get install -y python3 python3-venv python3-pip

echo "▶ ساخت محیط مجازی و نصب وابستگی‌ها…"
python3 -m venv .venv
.venv/bin/pip install --upgrade pip -q
.venv/bin/pip install -r requirements.txt -q

if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠ فایل server/.env ساخته شد. کلید LLM_API_KEY و LLM_BASE_URL و LLM_MODEL را داخلش بگذار، سپس دوباره این اسکریپت را اجرا کن."
fi

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
echo "✅ API روی http://127.0.0.1:8000 بالا آمد."
echo "   تست سلامت:  curl -s localhost:8000/api/health"
