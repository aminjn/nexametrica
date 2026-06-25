# استقرار روی آروان‌کلاد · Deploying to ArvanCloud

این پروژه یک **SPA استاتیک** است: خروجی `npm run build` در پوشه‌ی `dist/` کاملاً
ایستا و خودبسنده است (فونت Vazirmatn هم داخل باندل است، هیچ CDN خارجی لازم نیست).
ناوبری بین صفحات با state داخلی انجام می‌شود، پس **یک** `index.html` کافی است و
نیازی به تنظیم SPA-fallback/rewrite نیست.

```bash
npm ci
npm run build      # → dist/
```

دو روش رایج روی آروان‌کلاد:

---

## روش ۱ (پیشنهادی) — Object Storage + CDN

سریع، ارزان، و بدون سرور.

1. در پنل آروان‌کلاد یک **باکت Object Storage** بسازید (مثلاً `nexametrica`) و
   دسترسی آن را روی **public-read** بگذارید.
2. محتوای `dist/` را در ریشه‌ی باکت آپلود کنید. با `s3cmd`/`awscli` (سازگار با S3):

   ```bash
   # endpoint نمونه؛ از مقدار واقعی پنل آروان استفاده کنید
   export AWS_ACCESS_KEY_ID=...        # کلید دسترسی باکت
   export AWS_SECRET_ACCESS_KEY=...
   ENDPOINT=https://s3.ir-thr-at1.arvanstorage.ir

   aws s3 sync dist/ s3://nexametrica/ \
     --endpoint-url "$ENDPOINT" \
     --delete --acl public-read
   ```

3. **Index document** باکت را روی `index.html` تنظیم کنید (Static Website Hosting).
4. در بخش **CDN آروان‌کلاد**، دامنه‌ی خود را اضافه کنید و origin را همان باکت
   بگذارید؛ گواهی SSL رایگان را فعال کنید. کش فایل‌های `assets/*` (هش‌دار) را
   طولانی و کش `index.html` را کوتاه بگذارید.

نکته: چون `base: './'` در `vite.config.ts` تنظیم شده، اپ از هر مسیر/زیرپوشه‌ای
هم درست بارگذاری می‌شود.

---

## روش ۲ — کانتینر (Docker) روی آروان

اگر می‌خواهید روی سرویس کانتینری/ابری آروان اجرا کنید، با Nginx سرو کنید.
یک `Dockerfile` نمونه (در صورت نیاز همین را به ریشه اضافه کنید):

```dockerfile
# build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA تک‌صفحه‌ای؛ همه‌ی مسیرها به index.html
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri /index.html; }\n}\n' \
  > /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```bash
docker build -t nexametrica .
docker run -p 8080:80 nexametrica
```

سپس image را به رجیستری آروان push کرده و سرویس کانتینری را از روی آن بسازید.

---

## CI/CD با GitHub Actions (اختیاری)

برای استقرار خودکار روی هر push به شاخه‌ی اصلی، یک workflow بسازید که
`npm ci && npm run build` را اجرا و `dist/` را با همان `aws s3 sync` بالا آپلود کند
(کلیدهای باکت را به‌صورت GitHub Secrets نگه دارید). نمونه‌ی حداقلی:

```yaml
name: deploy
on: { push: { branches: [main] } }
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run build
      - run: |
          aws s3 sync dist/ s3://nexametrica/ \
            --endpoint-url "$ARVAN_ENDPOINT" --delete --acl public-read
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.ARVAN_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.ARVAN_SECRET }}
          ARVAN_ENDPOINT: ${{ secrets.ARVAN_ENDPOINT }}
```

---

## فعال‌کردن دستیار هوشمند (API بک‌اند)

دستیار با یک سرویس FastAPI کوچک (`server/`) به LLM وصل می‌شود؛ کلید API فقط
سمت سرور می‌ماند و هیچ‌وقت در مرورگر لو نمی‌رود. روی همان سرور آروان:

```bash
cd ~/nexametrica/server
cp .env.example .env
nano .env          # LLM_API_KEY و LLM_BASE_URL و LLM_MODEL را بگذار
sudo bash setup-api.sh     # venv + نصب + سرویس systemd روی 127.0.0.1:8000
```

سپس nginx را با کانفیگ به‌روز (که `/api` را پراکسی می‌کند) ری‌لود کن — اگر قبلاً
`arvan-deploy.sh` را اجرا کرده‌ای، یک‌بار دیگر بزن تا کانفیگ جدید کپی شود:

```bash
cd ~/nexametrica && git pull && sudo bash scripts/arvan-deploy.sh
```

تست:
```bash
curl -s localhost:8000/api/health        # باید llm_configured: true باشد
```

**انتخاب ارائه‌دهنده** (در `server/.env`): نمونه‌ها برای OpenAI / Gemini
(OpenAI-compatible) / DeepSeek در `server/.env.example` هست. اگر از سرور ایران
`api.openai.com` بلاک بود، `LLM_BASE_URL` را به گیت‌وی/پروکسیِ خودت بگذار.

> اگر API تنظیم نشده باشد، دستیار به‌صورت خودکار به پاسخ پیش‌فرض برمی‌گردد و
> سایت هیچ‌وقت نمی‌شکند.
