// Real telestration: draw freehand strokes, lines and arrows over the actual
// analysed keyframe. Coordinates are normalized (0..1) so they scale with the image.
import { useRef, useState, type PointerEvent as RPE } from 'react'
import { css } from '../lib/css'

type Shape = { type: 'free' | 'line' | 'arrow'; color: string; pts: [number, number][] }
const COLORS = ['#a3e635', '#38bdf8', '#ef4444', '#f59e0b', '#ffffff']

export function TelestrationCanvas({ src, fa }: { src: string; fa: boolean }) {
  const L = (f: string, e: string) => (fa ? f : e)
  const ref = useRef<HTMLDivElement>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [cur, setCur] = useState<Shape | null>(null)
  const [mode, setMode] = useState<Shape['type']>('arrow')
  const [color, setColor] = useState(COLORS[0])

  function rel(e: RPE): [number, number] {
    const r = ref.current!.getBoundingClientRect()
    return [
      Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    ]
  }
  function down(e: RPE) {
    const p = rel(e)
    setCur({ type: mode, color, pts: [p, p] })
    try { ref.current?.setPointerCapture(e.pointerId) } catch { /* */ }
  }
  function move(e: RPE) {
    if (!cur) return
    const p = rel(e)
    setCur((c) => {
      if (!c) return c
      if (c.type === 'free') return { ...c, pts: [...c.pts, p] }
      return { ...c, pts: [c.pts[0], p] }
    })
  }
  function up() {
    if (cur) setShapes((s) => [...s, cur])
    setCur(null)
  }

  const all = cur ? [...shapes, cur] : shapes
  const path = (pts: [number, number][]) => pts.map((p) => `${p[0] * 100},${p[1] * 100}`).join(' ')

  return (
    <div>
      <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap')}>
        <div style={css('display:flex;gap:4px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;padding:4px')}>
          {([['arrow', L('فلش', 'Arrow')], ['line', L('خط', 'Line')], ['free', L('آزاد', 'Free')]] as const).map(([m, lbl]) => (
            <button key={m} onClick={() => setMode(m)}
              style={css(`padding:6px 12px;border:none;border-radius:7px;font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer;background:${mode === m ? 'var(--ac)' : 'transparent'};color:${mode === m ? '#0d0f12' : 'var(--sub)'}`)}>
              {lbl}
            </button>
          ))}
        </div>
        <div style={css('display:flex;gap:5px')}>
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)}
              style={{ ...css('width:22px;height:22px;border-radius:6px;cursor:pointer'), background: c, border: color === c ? '2px solid #fff' : '2px solid var(--bd2)' }} />
          ))}
        </div>
        <div style={css('flex:1')}></div>
        <button onClick={() => setShapes((s) => s.slice(0, -1))} style={css('height:32px;padding:0 12px;background:var(--card2);border:1px solid var(--bd2);border-radius:8px;color:var(--sub);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer')}>{L('واگرد', 'Undo')}</button>
        <button onClick={() => setShapes([])} style={css('height:32px;padding:0 12px;background:var(--dngd);border:1px solid rgba(239,68,68,.3);border-radius:8px;color:var(--dng);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer')}>{L('پاک‌کردن', 'Clear')}</button>
      </div>
      <div ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up}
        style={css('position:relative;width:100%;border-radius:10px;overflow:hidden;touch-action:none;cursor:crosshair;background:#000')}>
        <img src={src} alt="" draggable={false} style={{ width: '100%', display: 'block', userSelect: 'none' }} />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            {COLORS.map((c) => (
              <marker key={c} id={`ah-${c.replace('#', '')}`} markerWidth="5" markerHeight="5" refX="3.5" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4 Z" fill={c} />
              </marker>
            ))}
          </defs>
          {all.map((s, i) => (
            <polyline key={i} points={path(s.pts)} fill="none" stroke={s.color} strokeWidth={0.7}
              strokeLinecap="round" strokeLinejoin="round"
              markerEnd={s.type === 'arrow' ? `url(#ah-${s.color.replace('#', '')})` : undefined} />
          ))}
        </svg>
      </div>
    </div>
  )
}
