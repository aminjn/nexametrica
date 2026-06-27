// Field calibration: drag the 4 pitch corners on the keyframe; the stored player
// points are projected (homography) onto a top-down pitch in real time, giving a
// true pitch heatmap (per team). Corners are saved to the job.
import { useEffect, useMemo, useRef, useState, type PointerEvent as RPE } from 'react'
import { css } from '../lib/css'
import { solveHomography, applyH, type Pt } from '../lib/homography'
import { Heatmap } from './Heatmap'
import { saveCalibration, getJob } from '../api'

const GW = 32
const GH = 20
const DEFAULT: Pt[] = [
  [0.12, 0.2],
  [0.88, 0.2],
  [0.96, 0.9],
  [0.04, 0.9],
]

function zeros() {
  return Array.from({ length: GH }, () => Array(GW).fill(0))
}

export function Calibration({ v, job }: { v: Record<string, any>; job: any }) {
  const fa = v.lang === 'fa'
  const L = (f: string, e: string) => (fa ? f : e)
  // The list endpoint omits keyframe/points (heavy); fetch the full job here.
  const [full, setFull] = useState<any>(job)
  useEffect(() => {
    getJob(job.id)
      .then(setFull)
      .catch(() => {})
  }, [job.id])
  const r = full.result || {}
  const points: number[][] = r.points || []
  const teams = r.teams

  const [corners, setCorners] = useState<Pt[]>(
    (job.calibration as Pt[]) || DEFAULT,
  )
  const [drag, setDrag] = useState<number | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const grids = useMemo(() => {
    const H = solveHomography(corners, [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ])
    const all = zeros()
    const a = zeros()
    const b = zeros()
    for (const p of points) {
      const [px, py] = applyH(H, [p[0], p[1]])
      if (px < 0 || px > 1 || py < 0 || py > 1) continue
      const gx = Math.min(GW - 1, Math.max(0, Math.floor(px * GW)))
      const gy = Math.min(GH - 1, Math.max(0, Math.floor(py * GH)))
      all[gy][gx]++
      if (p[2] === 0) a[gy][gx]++
      else if (p[2] === 1) b[gy][gx]++
    }
    return { all, a, b }
  }, [corners, points])

  function down(i: number, e: RPE) {
    setDrag(i)
    try {
      ref.current?.setPointerCapture(e.pointerId)
    } catch {
      /* */
    }
  }
  function move(e: RPE) {
    if (drag == null || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
    setCorners((cs) => cs.map((c, i) => (i === drag ? [Math.round(nx * 1e4) / 1e4, Math.round(ny * 1e4) / 1e4] : c)))
  }
  function up(e: RPE) {
    setDrag(null)
    try {
      ref.current?.releasePointerCapture(e.pointerId)
    } catch {
      /* */
    }
  }

  async function save() {
    try {
      await saveCalibration(job.id, corners)
      setMsg(L('کالیبراسیون ذخیره شد.', 'Calibration saved.'))
    } catch {
      setMsg(L('ذخیره نشد.', 'Save failed.'))
    }
  }

  const labels = ['۱', '۲', '۳', '۴']
  const poly = corners.map((c) => `${c[0] * 100},${c[1] * 100}`).join(' ')

  return (
    <div style={css('margin-top:14px;background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:14px')}>
      <div style={css('font-weight:800;font-size:13.5px;margin-bottom:6px')}>
        {L('کالیبراسیون زمین', 'Field calibration')}
      </div>
      <div style={css('font-size:11.5px;color:var(--mut);line-height:1.7;margin-bottom:12px')}>
        {L(
          'چهار دسته را روی گوشه‌های زمین بگذار — ۱: بالا-چپ، ۲: بالا-راست، ۳: پایین-راست، ۴: پایین-چپ. هیت‌مپِ تاپ‌ویو لحظه‌ای ساخته می‌شود.',
          'Drag the 4 handles to the pitch corners — 1: top-left, 2: top-right, 3: bottom-right, 4: bottom-left. The top-down heatmap updates live.',
        )}
      </div>
      <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start')}>
        {/* keyframe + draggable corners */}
        <div
          ref={ref}
          onPointerMove={move}
          onPointerUp={up}
          style={css('position:relative;width:100%;border-radius:8px;overflow:hidden;touch-action:none;user-select:none;background:#000')}
        >
          {r.keyframe ? (
            <img src={r.keyframe} alt="" draggable={false} style={{ width: '100%', display: 'block' }} />
          ) : (
            <div style={css('aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:12px')}>
              {L('فریمی موجود نیست', 'no keyframe')}
            </div>
          )}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <polygon points={poly} fill="rgba(163,230,53,.12)" stroke="var(--ac)" strokeWidth={0.4} />
          </svg>
          {corners.map((c, i) => (
            <div
              key={i}
              onPointerDown={(e) => down(i, e)}
              style={{
                position: 'absolute',
                left: `${c[0] * 100}%`,
                top: `${c[1] * 100}%`,
                transform: 'translate(-50%,-50%)',
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'var(--ac)',
                color: '#0d0f12',
                border: '2px solid #0d0f12',
                boxShadow: '0 2px 8px rgba(0,0,0,.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'grab',
                touchAction: 'none',
              }}
            >
              {fa ? labels[i] : i + 1}
            </div>
          ))}
        </div>

        {/* top-down result */}
        <div>
          {teams ? (
            <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:10px')}>
              <div>
                <div style={css('font-size:10.5px;font-weight:700;margin-bottom:5px;display:flex;align-items:center;gap:6px')}>
                  <span style={css(`width:11px;height:11px;border-radius:3px;background:${teams[0].color}`)}></span>
                  {L('تیم A', 'Team A')}
                </div>
                <Heatmap grid={grids.a} />
              </div>
              <div>
                <div style={css('font-size:10.5px;font-weight:700;margin-bottom:5px;display:flex;align-items:center;gap:6px')}>
                  <span style={css(`width:11px;height:11px;border-radius:3px;background:${teams[1].color}`)}></span>
                  {L('تیم B', 'Team B')}
                </div>
                <Heatmap grid={grids.b} />
              </div>
            </div>
          ) : (
            <div>
              <div style={css('font-size:10.5px;font-weight:700;color:var(--sub);margin-bottom:5px')}>
                {L('هیت‌مپِ تاپ‌ویو', 'Top-down heatmap')}
              </div>
              <Heatmap grid={grids.all} />
            </div>
          )}
          <div style={css('display:flex;gap:10px;align-items:center;margin-top:12px')}>
            <button
              onClick={save}
              style={css('height:34px;padding:0 16px;background:var(--ac);border:none;border-radius:9px;color:#0d0f12;font-family:inherit;font-size:12.5px;font-weight:800;cursor:pointer')}
            >
              {L('ذخیره‌ی کالیبراسیون', 'Save calibration')}
            </button>
            <button
              onClick={() => setCorners(DEFAULT)}
              style={css('height:34px;padding:0 14px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--sub);font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer')}
            >
              {L('بازنشانی', 'Reset')}
            </button>
            {msg ? <span style={css('font-size:11.5px;color:var(--good)')}>{msg}</span> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
