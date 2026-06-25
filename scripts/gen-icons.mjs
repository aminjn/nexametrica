// Rasterize the brand shield into PWA icons (dark square + lime mark).
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync(new URL('../public/', import.meta.url), { recursive: true })
const out = new URL('../public/', import.meta.url).pathname

const SHIELD = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="SIZE" height="SIZE">
  <path d="M12 2 4 6v6c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V6l-8-4Z" fill="#a3e635"/>
  <path d="M12 7v10M7.5 9.5l9 5M16.5 9.5l-9 5" stroke="#0d0f12" stroke-width="1.4" stroke-linecap="round"/>
</svg>`

function page(size, pct) {
  const inner = Math.round(size * pct)
  return `<!doctype html><html><head><style>
    *{margin:0;padding:0;box-sizing:border-box}
    #c{width:${size}px;height:${size}px;background:#0d0f12;display:flex;align-items:center;justify-content:center}
  </style></head><body><div id="c">${SHIELD.replace(/SIZE/g, inner)}</div></body></html>`
}

const targets = [
  { file: 'icon-192.png', size: 192, pct: 0.66 },
  { file: 'icon-512.png', size: 512, pct: 0.66 },
  { file: 'maskable-512.png', size: 512, pct: 0.56 }, // safe zone for masking
  { file: 'apple-touch-icon.png', size: 180, pct: 0.66 },
]

const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const p = await browser.newPage()
for (const t of targets) {
  await p.setViewportSize({ width: t.size, height: t.size })
  await p.setContent(page(t.size, t.pct))
  const el = await p.$('#c')
  await el.screenshot({ path: out + t.file })
  console.log('wrote', t.file)
}
await browser.close()
console.log('done')
