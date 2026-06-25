# Page porting guide (prototype HTML → React/TSX)

You convert ONE page section of `project/Nexa Metrica.dc.html` into a React
component in `src/pages/<Name>.tsx`. The logic/data already exist in
`src/engine.ts` (do NOT touch it). You only translate the **template markup**.

## Reference
Read these first — they are the canonical pattern:
- `src/pages/Dashboard.tsx`  ← fully-ported reference page
- `src/components/Box.tsx`    ← styled element with hover/focus
- `src/lib/css.ts`            ← `css('...')` CSS-string → style object

## Component skeleton
```tsx
import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines A–B (vm = v.vm = engine.vm_<page>()).
export function <Name>({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return ( /* the converted markup, wrapped exactly like the original */ )
}
```
The outer wrapper of most pages is `<div style={css('max-width:1320px;margin:0 auto')}>` — keep whatever the original section uses.

## Translation rules (mechanical, 1:1 — do not redesign)
1. `style="CSS"` → `style={css('CSS')}`. Keep the CSS string **verbatim**
   (including `var(--x)`, `inset-inline-start`, `padding-inline-start`, etc.).
2. CSS containing a binding, e.g. `background:{{ x.bg }}` → template literal:
   `style={css(\`background:${x.bg}\`)}`.
3. `style-hover="H"` and/or `style-focus="F"` → render the element via `<Box>`:
   `<Box as="button" css="..." hover="H" focus="F" onClick={fn}>…</Box>`.
   `Box` default tag is `div`; set `as="button" | "input" | "aside" | "select" | "label" | "span"` to match the original tag. Elements WITHOUT hover/focus stay plain JSX tags (don't wrap them).
4. Text/attr bindings:
   - `{{ vm.X }}`      → `{vm.X}`
   - `{{ t.X }}`       → `{t.X}`
   - `{{ modal.X }}`   → `{v.modal.X}`  (rare on pages)
   - bare top-level handler/value `{{ X }}` → `{v.X}`
     (these come from renderVals: `go, toggleLang, toggleAI, goLibrary, goClips,
      newChat, showcase, toggleShowcase, setFa, setEn, faBtnBg, faBtnFg, enBtnBg,
      enBtnFg, persona, setPersona`, …)
   - a loop variable’s field `{{ item.X }}` (from `sc-for as="item"`) → `{item.X}`
5. `<sc-for list="{{ items }}" as="it" …> CHILD </sc-for>` →
   `{items.map((it: any, i: number) => ( <Fragment-or-rootEl key={i}> CHILD </…> ))}`
   - `items` is usually `vm.something` → write `vm.something.map(...)`.
   - Put a `key` on the mapped root element. If the original child is multiple
     siblings, wrap them in `<Fragment key={i}>…</Fragment>` (import `Fragment`).
6. `<sc-if value="{{ cond }}" …> CHILD </sc-if>` → `{cond ? ( CHILD ) : null}`.
   - `cond` is `vm.x` / `v.x` / `item.x` per rule 4.
7. SVG/HTML attributes → JSX camelCase:
   `stroke-width`→`strokeWidth`, `stroke-linecap`→`strokeLinecap`,
   `stroke-linejoin`→`strokeLinejoin`, `stroke-dasharray`→`strokeDasharray`,
   `stroke-dashoffset`→`strokeDashoffset`, `fill-opacity`→`fillOpacity`,
   `text-anchor`→`textAnchor`, `class`→`className`, `for`→`htmlFor`.
   Keep `viewBox`, `d`, `cx`, `cy`, `r`, `x1`, `points`, etc. as-is.
   Self-close void elements (`<path … />`, `<circle … />`, `<input … />`).
8. Inputs with `value="{{ x }}"` + `onInput="{{ h }}"`: render
   `<input value={x} onChange={h} … />` (use `onChange`, not `onInput`, in React;
   if it’s a text box you may add both `onInput={h} onChange={h}`).
   For `<select value=…><option …>` use `onChange` and map options.
9. Chart/SVG values that come pre-built from the vm (e.g. `{{ vm.xgChart }}`,
   `{{ vm.heat }}`, `{{ vm.radar }}`, `{{ vm.possBars }}`) are already React
   elements/arrays — just render `{vm.xgChart}`.
10. Literal Persian digits / text in the markup stay **verbatim** (sample data).
11. Do not add libraries, comments-as-features, or restructure. Match the DOM.

## Output
- Create exactly `src/pages/<Name>.tsx` exporting `function <Name>`.
- It must be valid TSX. Use `any` freely for vm/item types (no need to model types).
- Do NOT edit engine.ts, registry, or other pages. The integrator wires the
  registry and runs the build.

## Finding the vm shape
Open `src/engine.ts`, search for `vm_<page>(){` and read what object it returns
(field names, whether each field is a string, array, or pre-built React element).
Each `{{ vm.field }}` in the template corresponds to a returned field.
