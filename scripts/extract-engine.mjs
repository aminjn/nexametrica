// Extracts the approved prototype's <script data-dc-script> Component class and
// wraps it as a framework-agnostic, observable Engine for the real app.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const src = readFileSync(new URL('../project/Nexa Metrica.dc.html', import.meta.url), 'utf8')
const lines = src.split('\n')

// 1-based: class starts at the `class Component extends DCLogic {` line, ends at
// its closing brace just before </script>.
const start = lines.findIndex((l) => l.includes('class Component extends DCLogic'))
const scriptEnd = lines.findIndex((l, i) => i > start && l.trim() === '</script>')
if (start < 0 || scriptEnd < 0) throw new Error('could not locate class boundaries')

// class body = from `class Component...` up to the line before </script>
let body = lines.slice(start, scriptEnd).join('\n').trimEnd()
body = body.replace('class Component extends DCLogic', 'class Engine extends Logic')

const header = `// @ts-nocheck
/* eslint-disable */
/**
 * AUTO-PORTED from \`project/Nexa Metrica.dc.html\` (the approved Claude Design
 * prototype's <script data-dc-script> Component class).
 *
 * The data, i18n strings, role/nav config, view-models (vm_*), the chart engine
 * and renderVals() are preserved VERBATIM. Only the React.Component-style base
 * (DCLogic) was swapped for a tiny observable \`Logic\` base, so the exact same
 * logic now drives a real Vite + React app instead of the design runtime.
 *
 * Regenerate with: node scripts/extract-engine.mjs
 */
import React from 'react'

class Logic {
  constructor() {
    this.state = {}
    this._subs = new Set()
  }
  // Supports both object and updater-fn forms, like React's setState.
  setState(update, cb) {
    const patch = typeof update === 'function' ? update(this.state) : update
    if (patch) this.state = { ...this.state, ...patch }
    this._subs.forEach((s) => s())
    if (cb) cb()
  }
  subscribe(fn) {
    this._subs.add(fn)
    return () => this._subs.delete(fn)
  }
  forceUpdate() {
    this._subs.forEach((s) => s())
  }
}

`

const footer = `

export const eng = new Engine()
export default eng
`

mkdirSync(new URL('../src/', import.meta.url), { recursive: true })
writeFileSync(new URL('../src/engine.ts', import.meta.url), header + body + footer)
console.log('Wrote src/engine.ts (' + (body.split('\n').length) + ' lines of ported class body)')
