// Top-down pitch heatmap: green pitch + lines, vivid blue→red ramp, sqrt
// contrast, group blur for smoothing. Shared by the Library results and the
// field-calibration panel.
export function PitchLines({ W, H }: { W: number; H: number }) {
  const s = 'rgba(255,255,255,.22)'
  return (
    <g fill="none" stroke={s} strokeWidth={1.2}>
      <rect x={1} y={1} width={W - 2} height={H - 2} rx={4} />
      <line x1={W / 2} y1={1} x2={W / 2} y2={H - 1} />
      <circle cx={W / 2} cy={H / 2} r={H * 0.13} />
      <rect x={1} y={H / 2 - H * 0.28} width={W * 0.14} height={H * 0.56} />
      <rect x={W - 1 - W * 0.14} y={H / 2 - H * 0.28} width={W * 0.14} height={H * 0.56} />
    </g>
  )
}

export function heatColor(v: number) {
  const hue = (1 - v) * 235 // blue → cyan → green → yellow → red
  return `hsl(${hue}, 92%, 52%)`
}

export function Heatmap({ grid }: { grid: number[][] }) {
  const rows = grid.length
  const cols = grid[0]?.length || 0
  let max = 1
  for (const r of grid) for (const c of r) if (c > max) max = c
  const W = 360
  const H = Math.round((W / cols) * rows)
  const cw = W / cols
  const ch = H / rows
  const blur = Math.max(3, cw * 0.7)
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', borderRadius: 8, background: 'rgba(40,110,55,.18)' }}
    >
      <g style={{ filter: `blur(${blur}px)` }}>
        {grid.flatMap((row, r) =>
          row.map((val, c) => {
            if (val <= 0) return null
            const v = Math.sqrt(val / max)
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cw}
                y={r * ch}
                width={cw + 1}
                height={ch + 1}
                fill={heatColor(v)}
                fillOpacity={0.25 + 0.75 * v}
              />
            )
          }),
        )}
      </g>
      <PitchLines W={W} H={H} />
    </svg>
  )
}
