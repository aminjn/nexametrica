// Capture verification screenshots of a few pages in both languages.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.env.SMOKE_URL || 'http://localhost:5176/'
mkdirSync('shots', { recursive: true })

const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForFunction(() => !!(window).__eng, null, { timeout: 10000 })

async function shot(name, patch) {
  await page.evaluate((p) => (window).__eng.setState(p), patch)
  await page.waitForTimeout(250)
  await page.screenshot({ path: `shots/${name}.png` })
  console.log('shot:', name)
}

await shot('01-dashboard-fa', { lang: 'fa', role: 'senior', page: 'dashboard', ai: false })
await shot('02-tactical-fa', { page: 'tactical' })
await shot('03-leaguedb-fa', { page: 'leaguedb', ldbView: 'myteam' })
await shot('04-sysadmin-fa', { role: 'super', page: 'sysadmin' })
await shot('05-dashboard-en', { lang: 'en', role: 'senior', page: 'dashboard' })
await shot('06-assistant-en', { page: 'assistant', ai: true })

await browser.close()
console.log('done')
