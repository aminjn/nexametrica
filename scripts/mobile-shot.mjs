import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
mkdirSync('shots', { recursive: true })
const PORT = process.env.PORT || '5190'
const b = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true })
await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })
await p.waitForFunction(() => !!window.__eng, null, { timeout: 10000 })
await p.evaluate(() => window.__eng.setState({ role: 'senior', page: 'dashboard', lang: 'fa' }))
await p.waitForTimeout(400)
await p.screenshot({ path: 'shots/m1-dashboard.png' })
await p.click('button[aria-label="menu"]')
await p.waitForTimeout(400)
await p.screenshot({ path: 'shots/m2-drawer.png' })
await b.close()
console.log('mobile shots ok')
