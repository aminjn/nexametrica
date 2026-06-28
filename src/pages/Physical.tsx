import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { Physical as RealPhysical } from '../components/Physical'
import { eng } from '../engine'

// Real physical analysis — driven entirely by the latest analysed video.
// (The old prototype mock — fabricated names, workload, injury risk — was removed.)
const ZONE_LABELS = ['۰–۷', '۷–۱۵', '۱۵–۲۰', '۲۰–۲۵', '۲۵+']
const ZONE_LABELS_EN = ['0–7', '7–15', '15–20', '20–25', '25+']
const ZONE_COLORS = ['#38bdf8', '#4ade80', '#a3e635', '#f59e0b', '#ef4444']

export function Physical({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const phys = (job as any)?.result?.physical

  if (!job || !phys?.players?.length) {
    return (
      <div style={css('max-width:1320px;margin:0 auto')}>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px;font-size:13px;color:var(--mut);line-height:1.9')}>
          {L('هنوز آنالیزِ فیزیکیِ واقعی‌ای نیست. در «کتابخانه ویدیو» یک ویدیوی پیوسته آپلود کن تا این صفحه با داده‌ی واقعی پر شود.',
            'No real physical analysis yet. Upload a continuous video in “Video Library” and this page fills with real data.')}
        </div>
      </div>
    )
  }

  const totalM =
    (phys.teams || []).reduce((s: number, tm: any) => s + (tm.distance_total_m || 0), 0) ||
    phys.players.reduce((s: number, p: any) => s + (p.distance_m || 0), 0)
  const top = Math.max(...phys.players.map((p: any) => p.max_speed_kmh || 0))
  const secs = Math.max(...phys.players.map((p: any) => p.seconds || 0))
  const zones: number[] = phys.speed_zones || [0, 0, 0, 0, 0]
  const zMax = Math.max(1, ...zones)

  const kpis: [string, string, string][] = [
    [L('مسافتِ کل (همه)', 'Total distance (all)'), faN((totalM / 1000).toFixed(2)), ' km'],
    [L('تعداد اسپرینت', 'Sprints'), faN(phys.sprints ?? 0), ''],
    [L('بیشینه سرعت', 'Top speed'), faN(Math.round(top * 10) / 10), ' km/h'],
    [L('بازیکنان (Re-ID)', 'Players (Re-ID)'), faN(phys.player_count), ''],
    [L('بازه‌ی ردیابی', 'Tracked span'), faN(Math.round(secs / 60)), ' min'],
  ]

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
        <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
        <div style={css('font-weight:800;font-size:15px')}>{L('آخرین آنالیزِ واقعی', 'Latest real analysis')}</div>
        <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
      </div>

      <div style={css('display:grid;grid-template-columns:repeat(5,1fr);gap:13px;margin-bottom:14px')}>
        {kpis.map(([lab, val, unit], i) => (
          <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px')}>
            <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>{lab}</div>
            <div style={css('font-size:23px;font-weight:800')}>{val}<span style={css('font-size:13px;color:var(--mut);font-weight:600')}>{unit}</span></div>
          </div>
        ))}
      </div>

      {/* real speed-zone distribution (seconds in each band, summed over players) */}
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:14px')}>
        <div style={css('font-weight:700;font-size:14px;margin-bottom:4px')}>{L('مناطق سرعتی (km/h)', 'Speed zones (km/h)')}</div>
        <div style={css('font-size:11px;color:var(--mut);margin-bottom:16px')}>{L('مجموعِ زمانِ همه‌ی بازیکنان در هر بازه‌ی سرعت', 'Total player-time in each speed band')}</div>
        <div style={css('display:flex;align-items:flex-end;gap:14px;height:150px')}>
          {zones.map((z, i) => (
            <div key={i} style={css('flex:1;display:flex;flex-direction:column;align-items:center;gap:7px;height:100%;justify-content:flex-end')}>
              <div style={css('font-size:11px;color:var(--sub);font-weight:700')}>{faN(Math.round(z))}{L('ث', 's')}</div>
              <div style={css(`width:100%;border-radius:7px 7px 0 0;background:${ZONE_COLORS[i]};height:${Math.max(3, (z / zMax) * 100)}%`)}></div>
              <div style={css('font-size:11px;color:var(--mut)')}>{fa ? ZONE_LABELS[i] : ZONE_LABELS_EN[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* per-player distance/speed + heatmaps + calibration check */}
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:4px 16px 16px')}>
        <RealPhysical v={v} job={job} />
      </div>
    </div>
  )
}
