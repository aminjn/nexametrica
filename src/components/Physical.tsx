// Real physical analytics from automatic per-frame pitch calibration: distance
// covered and speed (km/h) per team and per player, plus the true top-down pitch
// heatmap in real metres. No manual corner-dragging needed — the worker computed
// a homography on every frame.
import { useEffect, useState } from 'react'
import { css } from '../lib/css'
import { Heatmap } from './Heatmap'
import { getJob } from '../api'
import { eng } from '../engine'
import { useRosterFull, bmiOf, bmiColor } from '../lib/useRoster'

export function Physical({ v, job }: { v: Record<string, any>; job: any }) {
  const fa = v.lang === 'fa'
  const L = (f: string, e: string) => (fa ? f : e)
  const faN = (s: any) => (eng as any).faN(s)
  const r = job.result || {}
  const phys = r.physical
  const single = !!r.single_team || !!(job as any).single_override
  const roster = useRosterFull()
  const teamsMeta = r.teams || []
  const colorOf = (i: number) => teamsMeta[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')

  // pitch heatmaps are stripped from the list payload; fetch the full job
  const [full, setFull] = useState<any>(null)
  useEffect(() => {
    getJob(job.id)
      .then(setFull)
      .catch(() => {})
  }, [job.id])
  const fr = full?.result || {}

  if (!phys) return null
  const [plen, pwid] = phys.pitch_m || [105, 68]

  return (
    <div style={css('margin-top:14px;background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:14px')}>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap')}>
        <span style={css(`font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px;${phys.approx ? 'background:var(--warnd);color:var(--warn)' : 'background:var(--aid);color:var(--ai)'}`)}>
          {phys.approx ? L('تخمینی (بدون کالیبراسیون)', 'Approximate (uncalibrated)') : L('کالیبراسیونِ خودکار', 'Auto-calibrated')}
        </span>
        <div style={css('font-weight:800;font-size:13.5px')}>{L('تحلیلِ فیزیکی', 'Physical analytics')}</div>
      </div>
      <div style={css('font-size:11px;color:var(--mut);margin-bottom:10px;line-height:1.7')}>
        {phys.approx
          ? L(
              `کالیبراسیونِ زمین روی این کلیپ نگرفت، پس مسافت/سرعت با مقیاسِ تخمینی (از قدِ بازیکن) محاسبه شده — تقریبی است. ~${faN(phys.player_count || 0)} بازیکنِ هم‌زمان روی صحنه؛ ${faN(phys.reid_players ?? 0)} ردیابی‌شده (از ${faN(phys.raw_tracks || 0)} ردِ خام).`,
              `Pitch calibration didn't lock on this clip, so distance/speed use an approximate scale (player height) — treat as estimates. ~${phys.player_count || 0} players on screen; ${phys.reid_players ?? 0} tracked (from ${phys.raw_tracks || 0} raw tracks).`,
            )
          : L(
              `مختصاتِ واقعیِ زمین (متر) از هوموگرافیِ هر فریم — زمینِ ${faN(plen)}×${faN(pwid)} متر. ~${faN(phys.player_count || 0)} بازیکنِ هم‌زمان روی صحنه؛ ${faN(phys.reid_players ?? 0)} بازیکنِ ردیابی‌شده (از ${faN(phys.raw_tracks || 0)} ردِ خام).`,
              `Real pitch coordinates (metres) from per-frame homography — ${plen}×${pwid} m pitch. ~${phys.player_count || 0} players on screen; ${phys.reid_players ?? 0} tracked after Re-ID (from ${phys.raw_tracks || 0} raw tracks).`,
            )}
      </div>

      {/* visual proof: pitch model reprojected onto a real frame */}
      {fr.calibration_check ? (
        <div style={css('margin-bottom:14px')}>
          <div style={css('font-size:11px;font-weight:700;color:var(--sub);margin-bottom:6px')}>
            {L('صحت‌سنجیِ کالیبراسیون (خطوطِ سبز باید روی خطوطِ زمین بیفتند)', 'Calibration check (green lines should sit on the real pitch lines)')}
          </div>
          <img src={fr.calibration_check} alt="" style={{ width: '100%', maxWidth: 560, borderRadius: 8, display: 'block', border: '1px solid var(--bd)' }} />
        </div>
      ) : null}

      {/* per-team rollup (merged into one when single-kit / override) */}
      {(() => {
        const cards = single
          ? [{
              team: 0,
              players: phys.player_count,
              top_speed_kmh: Math.max(0, ...(phys.players || []).map((p: any) => p.max_speed_kmh || 0)),
              distance_total_m: (phys.players || []).reduce((s: number, p: any) => s + (p.distance_m || 0), 0),
              distance_avg_m: phys.player_count ? (phys.players || []).reduce((s: number, p: any) => s + (p.distance_m || 0), 0) / phys.player_count : 0,
            }]
          : (phys.teams || [])
        return cards.length ? (
          <div style={css(`display:grid;grid-template-columns:${single ? '1fr' : '1fr 1fr'};gap:10px;margin-bottom:14px`)}>
            {cards.map((tm: any, i: number) => (
              <div key={i} style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:11px 12px')}>
                <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:8px')}>
                  <span style={css(`width:12px;height:12px;border-radius:4px;background:${colorOf(tm.team)};border:1px solid rgba(255,255,255,.25)`)}></span>
                  <span style={css('font-size:12.5px;font-weight:800')}>{single ? L('همه‌ی بازیکنان', 'All players') : `${L('تیم', 'Team')} ${tm.team === 0 ? 'A' : 'B'}`}</span>
                </div>
                <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:8px')}>
                  <Stat lab={L('بیشینه سرعت', 'Top speed')} val={`${faN(Math.round((tm.top_speed_kmh || 0) * 10) / 10)} ${L('کیلومتر/ساعت', 'km/h')}`} />
                  <Stat lab={L('بازیکنان', 'Players')} val={faN(tm.players)} />
                  <Stat lab={L('مسافتِ کل', 'Total dist')} val={`${faN(Math.round(tm.distance_total_m))} ${L('م', 'm')}`} />
                  <Stat lab={L('میانگین/بازیکن', 'Avg/player')} val={`${faN(Math.round(tm.distance_avg_m || 0))} ${L('م', 'm')}`} />
                </div>
              </div>
            ))}
          </div>
        ) : null
      })()}

      {/* per-player (after Re-ID stitching) */}
      {phys.players?.length ? (
        <div style={css('margin-bottom:14px')}>
          <div style={css('font-size:11px;font-weight:700;color:var(--sub);margin-bottom:7px')}>
            {L('بازیکنان — مسافت و سرعت (پس از Re-ID)', 'Players — distance & speed (after Re-ID)')}
          </div>
          <div style={css('display:flex;flex-direction:column;gap:4px')}>
            {phys.players.slice(0, 12).map((p: any) => {
              const prof = p.number ? roster[String(p.number)] : undefined
              const bmi = bmiOf(prof)
              const meas = prof ? [[L('ران', 'thigh'), prof.thigh], [L('ساق', 'calf'), prof.calf], [L('سینه', 'chest'), prof.chest], [L('بازو', 'arm'), prof.arm]].filter(([, x]) => x) : []
              return (
              <div key={p.player} style={css('display:flex;align-items:center;gap:9px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:7px 11px;flex-wrap:wrap')}>
                <span style={css(`width:10px;height:10px;border-radius:3px;flex-shrink:0;background:${p.team === -1 ? 'var(--mut)' : colorOf(p.team)};border:1px solid rgba(255,255,255,.2)`)}></span>
                <span style={css('font-size:11.5px;font-weight:700;width:140px;display:inline-flex;align-items:center;gap:6px;overflow:hidden')}>
                  {p.number ? (
                    <>
                      <span style={css('min-width:22px;height:22px;padding:0 5px;border-radius:6px;background:var(--ac);color:#0d0f12;font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:12px')} title={L('شماره‌ی پیراهن', 'Jersey number')}>{faN(p.number)}</span>
                      <span style={css('font-size:9.5px;color:var(--ac);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{prof?.name || L('پیراهن', 'shirt')}</span>
                    </>
                  ) : (
                    <span style={css('color:var(--mut)')} title={L('شماره خوانده نشد', 'number not read')}>{L('بازیکن', 'P')} {faN(p.player)}</span>
                  )}
                </span>
                <div style={css('flex:1;min-width:80px;height:6px;background:var(--raised);border-radius:4px;overflow:hidden')}>
                  <div style={css(`height:100%;border-radius:4px;background:${p.team === -1 ? 'var(--mut)' : colorOf(p.team)};width:${Math.min(100, (p.distance_m / (phys.players[0].distance_m || 1)) * 100)}%`)}></div>
                </div>
                <span style={css('font-size:11.5px;font-weight:700;width:64px;text-align:end')}>{p.distance_m >= 1000 ? `${faN((p.distance_m / 1000).toFixed(2))} ${L('کم', 'km')}` : `${faN(Math.round(p.distance_m))} ${L('م', 'm')}`}</span>
                <span style={css('font-size:11px;color:var(--mut);width:78px;text-align:end')}>{faN(p.max_speed_kmh)} {L('ک/س', 'km/h')}</span>
                {bmi ? (
                  <span style={css(`font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:20px;color:#0d0f12;background:${bmiColor(bmi)}`)} title={L('شاخصِ تودهٔ بدنی', 'Body-mass index')}>BMI {faN(bmi)}</span>
                ) : null}
                {meas.length ? (
                  <span style={css('font-size:9.5px;color:var(--mut);font-family:monospace;width:100%;padding-inline-start:19px')} title={L('اندازه‌های بدن (cm)', 'Body measurements (cm)')}>{meas.map(([k, x]) => `${k} ${faN(x)}`).join(' · ')}</span>
                ) : null}
              </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* true top-down pitch heatmap (real metres) */}
      {!single && fr.pitch_heatmap_a && fr.pitch_heatmap_b ? (
        <div>
          <div style={css('font-size:11px;font-weight:700;color:var(--sub);margin-bottom:8px')}>
            {L('نقشه‌ی حرارتیِ تاپ‌ویوِ واقعی (متر)', 'True top-down heatmap (metres)')}
          </div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:12px')}>
            <div>
              <div style={css('font-size:10.5px;font-weight:700;margin-bottom:5px;display:flex;align-items:center;gap:6px')}>
                <span style={css(`width:11px;height:11px;border-radius:3px;background:${colorOf(0)};border:1px solid rgba(255,255,255,.25)`)}></span>
                {L('تیم A', 'Team A')}
              </div>
              <Heatmap grid={fr.pitch_heatmap_a} />
            </div>
            <div>
              <div style={css('font-size:10.5px;font-weight:700;margin-bottom:5px;display:flex;align-items:center;gap:6px')}>
                <span style={css(`width:11px;height:11px;border-radius:3px;background:${colorOf(1)};border:1px solid rgba(255,255,255,.25)`)}></span>
                {L('تیم B', 'Team B')}
              </div>
              <Heatmap grid={fr.pitch_heatmap_b} />
            </div>
          </div>
        </div>
      ) : fr.pitch_heatmap ? (
        <Heatmap grid={fr.pitch_heatmap} />
      ) : phys.approx ? null : (
        <div style={css('font-size:11px;color:var(--mut)')}>{L('در حال بارگذاریِ نقشه…', 'Loading heatmap…')}</div>
      )}
    </div>
  )
}

function Stat({ lab, val }: { lab: string; val: any }) {
  return (
    <div>
      <div style={css('font-size:9.5px;color:var(--mut);margin-bottom:2px')}>{lab}</div>
      <div style={css('font-size:14px;font-weight:800')}>{val}</div>
    </div>
  )
}
