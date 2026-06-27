// Real physical analytics from automatic per-frame pitch calibration: distance
// covered and speed (km/h) per team and per player, plus the true top-down pitch
// heatmap in real metres. No manual corner-dragging needed — the worker computed
// a homography on every frame.
import { useEffect, useState } from 'react'
import { css } from '../lib/css'
import { Heatmap } from './Heatmap'
import { getJob } from '../api'
import { eng } from '../engine'

export function Physical({ v, job }: { v: Record<string, any>; job: any }) {
  const fa = v.lang === 'fa'
  const L = (f: string, e: string) => (fa ? f : e)
  const faN = (s: any) => (eng as any).faN(s)
  const r = job.result || {}
  const phys = r.physical
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
        <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>
          {L('کالیبراسیونِ خودکار', 'Auto-calibrated')}
        </span>
        <div style={css('font-weight:800;font-size:13.5px')}>{L('تحلیلِ فیزیکیِ واقعی', 'Real physical analytics')}</div>
      </div>
      <div style={css('font-size:11px;color:var(--mut);margin-bottom:10px;line-height:1.7')}>
        {L(
          `مختصاتِ واقعیِ زمین (متر) از هوموگرافیِ هر فریم — زمینِ ${faN(plen)}×${faN(pwid)} متر، ${faN(phys.stable_tracks || 0)} ردِ پایدار.`,
          `Real pitch coordinates (metres) from per-frame homography — ${plen}×${pwid} m pitch, ${phys.stable_tracks || 0} stable tracks.`,
        )}
      </div>
      <div style={css('font-size:10.5px;color:var(--warn);background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);border-radius:8px;padding:8px 10px;margin-bottom:12px;line-height:1.7')}>
        {L(
          'این آمار per «ردِ ردیابی» است، نه per بازیکنِ کامل. ردیاب یک بازیکن را به چند ردِ کوتاه می‌شکند؛ مسافتِ کاملِ هر بازیکن در کلِ بازی نیاز به مرحله‌ی Re-ID دارد (وصل‌کردنِ ردها) — قدمِ بعدی. سرعت‌ها و هیت‌مپ واقعی‌اند.',
          'Stats are per tracking-segment, not per full player. The tracker splits a player into several short tracks; full per-player match distance needs a Re-ID step — coming next. Speeds and heatmap are real.',
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

      {/* per-team rollup */}
      {phys.teams?.length ? (
        <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px')}>
          {phys.teams.map((tm: any) => (
            <div key={tm.team} style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:11px 12px')}>
              <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:8px')}>
                <span style={css(`width:12px;height:12px;border-radius:4px;background:${colorOf(tm.team)};border:1px solid rgba(255,255,255,.25)`)}></span>
                <span style={css('font-size:12.5px;font-weight:800')}>{L('تیم', 'Team')} {tm.team === 0 ? 'A' : 'B'}</span>
              </div>
              <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:8px')}>
                <Stat lab={L('بیشینه سرعت', 'Top speed')} val={`${faN(tm.top_speed_kmh)} ${L('کیلومتر/ساعت', 'km/h')}`} />
                <Stat lab={L('ردهای پایدار', 'Stable tracks')} val={faN(tm.tracks)} />
                <Stat lab={L('مسافتِ ردها (جمع)', 'Tracks distance (sum)')} val={`${faN(Math.round(tm.distance_total_m))} ${L('م', 'm')}`} />
                <Stat lab={L('زمانِ ردیابی', 'Tracked time')} val={`${faN(Math.round(tm.track_seconds || 0))} ${L('ث', 's')}`} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* top movers */}
      {phys.per_track?.length ? (
        <div style={css('margin-bottom:14px')}>
          <div style={css('font-size:11px;font-weight:700;color:var(--sub);margin-bottom:7px')}>
            {L('پرتکاپوترین ردها (در بازه‌ی ردیابی)', 'Most active tracks (within their segment)')}
          </div>
          <div style={css('display:flex;flex-direction:column;gap:4px')}>
            {phys.per_track.slice(0, 8).map((p: any) => (
              <div key={p.track} style={css('display:flex;align-items:center;gap:9px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:7px 11px')}>
                <span style={css(`width:10px;height:10px;border-radius:3px;flex-shrink:0;background:${p.team === -1 ? 'var(--mut)' : colorOf(p.team)};border:1px solid rgba(255,255,255,.2)`)}></span>
                <span style={css('font-size:11.5px;font-weight:700;width:46px')}>#{faN(p.track)}</span>
                <div style={css('flex:1;height:6px;background:var(--raised);border-radius:4px;overflow:hidden')}>
                  <div style={css(`height:100%;border-radius:4px;background:${p.team === -1 ? 'var(--mut)' : colorOf(p.team)};width:${Math.min(100, (p.distance_m / (phys.per_track[0].distance_m || 1)) * 100)}%`)}></div>
                </div>
                <span style={css('font-size:11px;color:var(--mut);width:50px;text-align:end')}>{faN(Math.round(p.seconds || 0))}{L('ث', 's')}</span>
                <span style={css('font-size:11.5px;font-weight:700;width:66px;text-align:end')}>{faN(Math.round(p.distance_m))} {L('م', 'm')}</span>
                <span style={css('font-size:11px;color:var(--mut);width:78px;text-align:end')}>{faN(p.max_speed_kmh)} {L('ک/س', 'km/h')}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* true top-down pitch heatmap (real metres) */}
      {fr.pitch_heatmap_a && fr.pitch_heatmap_b ? (
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
      ) : (
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
