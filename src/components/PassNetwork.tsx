// Real passing network: nodes are players at their average pitch position, edges
// are completed passes between teammates (width ∝ count). Data comes from the
// worker's ball-owner sequence (physical.passes).
import { css } from '../lib/css'

type Node = { id: number; team: number; number?: string | null; x: number; y: number }
type Edge = { from: number; to: number; count: number; team: number }

export function PassNetwork({
  nodes, edges, team, color, label,
}: { nodes: Node[]; edges: Edge[]; team: number; color: string; label: string }) {
  const ns = nodes.filter((n) => n.team === team)
  const es = edges.filter((e) => e.team === team)
  const pos = new Map(ns.map((n) => [n.id, n]))
  const maxC = Math.max(1, ...es.map((e) => e.count))
  const deg = new Map<number, number>()
  for (const e of es) {
    deg.set(e.from, (deg.get(e.from) || 0) + e.count)
    deg.set(e.to, (deg.get(e.to) || 0) + e.count)
  }
  const maxDeg = Math.max(1, ...deg.values())
  // pitch is drawn 105x68 aspect; map normalized x,y (0..1) to a 0..100 / 0..65 box
  const X = (x: number) => 2 + x * 96
  const Y = (y: number) => 2 + y * 61

  return (
    <div>
      <div style={css('font-size:11px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px')}>
        <span style={css(`width:11px;height:11px;border-radius:3px;background:${color}`)}></span>
        {label}
      </div>
      <div style={css('position:relative;width:100%;aspect-ratio:105/68;background:#11271b;border:1px solid var(--bd);border-radius:10px;overflow:hidden')}>
        <svg viewBox="0 0 100 65" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* pitch lines */}
          <g stroke="rgba(255,255,255,.18)" strokeWidth={0.3} fill="none">
            <rect x={2} y={2} width={96} height={61} />
            <line x1={50} y1={2} x2={50} y2={63} />
            <circle cx={50} cy={32.5} r={8} />
          </g>
          {/* edges */}
          {es.map((e, i) => {
            const a = pos.get(e.from), b = pos.get(e.to)
            if (!a || !b) return null
            return (
              <line key={i} x1={X(a.x)} y1={Y(a.y)} x2={X(b.x)} y2={Y(b.y)}
                stroke={color} strokeOpacity={0.25 + 0.55 * (e.count / maxC)}
                strokeWidth={0.4 + 2.2 * (e.count / maxC)} strokeLinecap="round" />
            )
          })}
          {/* nodes */}
          {ns.map((n) => {
            const r = 1.4 + 2.2 * ((deg.get(n.id) || 0) / maxDeg)
            return (
              <g key={n.id}>
                <circle cx={X(n.x)} cy={Y(n.y)} r={r} fill={color} stroke="#0d0f12" strokeWidth={0.3} />
                {n.number ? (
                  <text x={X(n.x)} y={Y(n.y) + 0.9} fontSize={2.4} fontWeight="800" fill="#0d0f12"
                    textAnchor="middle">{n.number}</text>
                ) : null}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
