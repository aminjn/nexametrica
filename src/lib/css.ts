// Faithful re-implementation of the dc-runtime's `cssToObj` so we can keep the
// prototype's exact inline-CSS strings verbatim. Logical properties
// (inset-inline-start, padding-inline-start, …) become camelCase and React
// applies them respecting `dir`, which gives us RTL/LTR mirroring for free.
import type { CSSProperties } from 'react'

const kebabToCamel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())

const cache = new Map<string, CSSProperties>()

export function css(input?: string | CSSProperties): CSSProperties {
  if (!input) return {}
  if (typeof input !== 'string') return input
  const hit = cache.get(input)
  if (hit) return hit
  const o: Record<string, string> = {}
  for (const decl of input.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim()
    if (!prop) continue
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim()
  }
  const out = o as CSSProperties
  cache.set(input, out)
  return out
}

// Merge a base CSS string/object with overrides (used for hover/focus states).
export function mergeCss(
  base?: string | CSSProperties,
  extra?: string | CSSProperties,
): CSSProperties {
  return { ...css(base), ...css(extra) }
}
