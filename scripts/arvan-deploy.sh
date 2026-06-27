#!/usr/bin/env bash
# دیپلوی نکسا متریکا روی یک سرور ابری آروان (Ubuntu 22.04/24.04).
#
# بار اول (روی سرور، بعد از clone کردن ریپو):
#   git clone https://github.com/aminjn/nexametrica.git ~/nexametrica
#   cd ~/nexametrica
#   sudo bash scripts/arvan-deploy.sh
#
# آپدیت‌های بعدی:
#   cd ~/nexametrica && git pull && sudo bash scripts/arvan-deploy.sh
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEB_ROOT="/var/www/nexametrica"

echo "▶ نصب پیش‌نیازها (Node 22, nginx, git)…"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -dv -f2 | cut -d. -f1)" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
apt-get install -y nginx git

echo "▶ ساخت نسخه‌ی تولید…"
cd "$REPO_DIR"
# اگر به‌عنوان root اجرا شده، npm را با کاربر معمولی هم می‌توان اجرا کرد؛ اینجا root است.
npm ci
npm run build

echo "▶ کپی dist/ به $WEB_ROOT …"
rm -rf "$WEB_ROOT"
mkdir -p "$WEB_ROOT"
cp -r dist/. "$WEB_ROOT/"

echo "▶ پیکربندی nginx…"
cp "$REPO_DIR/deploy/nginx-nexametrica.conf" /etc/nginx/sites-available/nexametrica
ln -sf /etc/nginx/sites-available/nexametrica /etc/nginx/sites-enabled/nexametrica
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# اگر سرویسِ API نصب است، آن را هم ری‌استارت کن تا تغییراتِ بک‌اند اعمال شود
if systemctl list-unit-files | grep -q '^nexametrica-api\.service'; then
  echo "▶ ری‌استارتِ API بک‌اند…"
  systemctl restart nexametrica-api || true
fi

echo "✅ انجام شد. آدرس: http://<IP-سرور>/  (یا دامنه‌ای که در کانفیگ گذاشتی)"
echo "   برای HTTPS رایگان:  apt-get install -y certbot python3-certbot-nginx && certbot --nginx -d دامنه‌ات"
