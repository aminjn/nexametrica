# Worker بینایی ماشین (Z440 / RTX 3070)

این worker روی کامپیوترِ خودت (Z440 با گرافیک ۳۰۷۰) اجرا می‌شود — **نه** روی سرور
آروان. ویدیو را با **YOLO11** (تشخیص بازیکن + توپ، بدون نیاز به آموزش) و **ByteTrack**
(ردیابی) پردازش می‌کند و نتیجه را به API سایت می‌فرستد. چون فقط **بیرون‌رفت**
(outbound) به سایت وصل می‌شود، پشت NAT خانه هم بدون پورت‌فوروارد کار می‌کند.

## پیش‌نیاز
- اوبونتو با **درایور NVIDIA** نصب‌شده. تست: `nvidia-smi` باید کارت را نشان دهد.
  (اگر درایور نداری: `sudo ubuntu-drivers autoinstall && reboot`)

## نصب
```bash
git clone https://github.com/aminjn/nexametrica.git ~/nexametrica   # اگر نداری
cd ~/nexametrica/worker
bash setup-worker.sh
nano .env        # API_BASE=https://mt.nexxaai.ir/api
```

## استفاده
**تستِ یک ویدیوی محلی** (سریع‌ترین راه برای دیدنِ خروجی):
```bash
.venv/bin/python worker.py process /path/to/match.mp4
```
بعد در سایت، نتیجه به‌صورت یک «job» ثبت می‌شود (آمار بازیکن/توپ + هیت‌مپ).

**حالت سرویس** — صفِ ویدیوهایی که از خود سایت آپلود می‌شوند را پردازش می‌کند:
```bash
.venv/bin/python worker.py serve
```

## اجرای دائمی با systemd (اختیاری)
```bash
sudo tee /etc/systemd/system/nexa-worker.service >/dev/null <<UNIT
[Unit]
Description=Nexa Metrica GPU worker
After=network.target

[Service]
WorkingDirectory=%h/nexametrica/worker
EnvironmentFile=%h/nexametrica/worker/.env
ExecStart=%h/nexametrica/worker/.venv/bin/python worker.py serve
Restart=always
RestartSec=5
User=%u

[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload
sudo systemctl enable --now nexa-worker
journalctl -u nexa-worker -f      # دیدن لاگ زنده
```

## تنظیمات (worker/.env)
- `MODEL`: `yolo11n/s/m/l/x.pt` — روی ۳۰۷۰ ۸ گیگ، `m` یا `l` خوب است.
- `SAMPLE`: هر چند فریم یک‌بار (۳ = سریع‌تر، ۱ = دقیق‌تر/کندتر).
- `IMGSZ`: ۱۲۸۰ پیش‌فرض؛ اگر VRAM کم آورد، ۹۶۰ بگذار.
- `DEVICE`: `0` برای GPU.

## کالیبراسیونِ خودکارِ زمین (per-frame) — مختصاتِ واقعیِ متری
چون دوربینِ پخش پن/زوم می‌کند، یک کالیبراسیونِ ثابت کافی نیست. این worker روی **هر فریم**
یک مدلِ تشخیصِ نقاطِ کلیدیِ زمین اجرا می‌کند، هوموگرافیِ همان فریم را می‌سازد و پای هر
بازیکن را به مختصاتِ واقعیِ زمین (متر) می‌برد. خروجی: هیت‌مپِ تاپ‌ویوِ واقعی + **مسافت و
سرعتِ واقعی (متر و کیلومتر/ساعت)** برای هر بازیکن و هر تیم.

- نصبِ خودکارش در `setup-worker.sh` انجام می‌شود (`inference` + `roboflow/sports`).
- در `.env` کلیدِ رایگانِ Roboflow را بگذار: `ROBOFLOW_API_KEY=...` (بارِ اول برای دانلودِ
  وزن‌ها لازم است). با `PITCH=0` می‌توانی خاموشش کنی و فقط کالیبراسیونِ دستی بماند.
- اگر این بخش نصب/دانلود نشد، worker بدونِ خطا ادامه می‌دهد و کالیبراسیونِ **دستیِ**
  ۴-گوشه در سایت در دسترس می‌ماند.

## این نسخه چه می‌دهد
- تعداد بازیکنانِ تشخیص‌داده‌شده (میانگین/بیشینه) + تعداد ردِ یکتا (ByteTrack)
- تفکیکِ تیم با رنگِ پیراهن + هیت‌مپِ هر تیم
- تشخیص و مسیرِ توپ
- **کالیبراسیونِ خودکارِ per-frame** → هیت‌مپِ واقعیِ متری + مسافت/سرعتِ واقعی
- کالیبراسیونِ دستیِ ۴-گوشه به‌عنوان fallback

قدم‌های بعدی (به‌مرور): شبکه‌ی پاس، کنترلِ فضا (pitch control)، و تشخیص رویداد
(پاس/شوت) — همه روی همین worker.
