// Runtime smoke test: loads the dev server and renders every page in both
// languages and a couple of roles, asserting no console/page errors and that
// content actually paints. Uses the dev-only window.__eng hook.
import { chromium } from 'playwright'

const URL = process.env.SMOKE_URL || 'http://localhost:5173/'
const PAGES = [
  'dashboard', 'library', 'gamecloud', 'model', 'player', 'coding', 'matrix',
  'dataint', 'telestration', 'tactical', 'physical', 'profile', 'scouting',
  'leaguedb', 'transfer', 'schedule', 'training', 'nutrition', 'reports',
  'clips', 'sharing', 'assistant', 'settings', 'sysadmin',
]

const errors = []
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const page = await browser.newPage()
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('[console] ' + m.text())
})
page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message))

await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForFunction(() => !!(window).__eng, null, { timeout: 10000 })

async function setState(patch) {
  await page.evaluate((p) => (window).__eng.setState(p), patch)
  await page.waitForTimeout(60)
}

let checked = 0
for (const lang of ['fa', 'en']) {
  // super role can reach few pages; senior can reach the most. Force role=senior
  // and lang, then visit each page directly.
  await setState({ lang, role: 'senior' })
  for (const pg of PAGES) {
    const before = errors.length
    await setState({ page: pg })
    // assert main content rendered something
    const text = await page.evaluate(() => {
      const main = document.querySelector('main')
      return main ? main.innerText.trim().length : -1
    })
    if (text <= 0) errors.push(`[empty] ${lang}/${pg} main content length=${text}`)
    if (errors.length > before) {
      errors.push(`  ^ occurred on ${lang}/${pg}`)
    }
    checked++
  }
}

// Role switching: ensure each role's home renders.
for (const role of ['analyst', 'coach', 'player', 'admin', 'super']) {
  const before = errors.length
  await setState({ role })
  const text = await page.evaluate(() => {
    const main = document.querySelector('main')
    return main ? main.innerText.trim().length : -1
  })
  if (text <= 0) errors.push(`[empty] role=${role} home content length=${text}`)
  if (errors.length > before) errors.push(`  ^ occurred on role ${role}`)
}

// AI panel + dir check
await setState({ lang: 'fa', role: 'senior', page: 'dashboard', ai: true })
const dir = await page.evaluate(() => document.documentElement.dir)
if (dir !== 'rtl') errors.push(`[dir] expected rtl in fa, got ${dir}`)
await setState({ lang: 'en' })
const dir2 = await page.evaluate(() => document.documentElement.dir)
if (dir2 !== 'ltr') errors.push(`[dir] expected ltr in en, got ${dir2}`)

await browser.close()

console.log(`Checked ${checked} page renders (24 pages × 2 langs) + 5 roles + dir/AI.`)
if (errors.length) {
  console.error(`\nFAILURES (${errors.length}):`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('SMOKE OK — all pages rendered with no console/page errors.')
