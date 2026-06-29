import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Real — summary of the latest analysed video. No mock.
export function Dashboard({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const phys = (job as any)?.result?.physical

  let real: [string, string, string][] | null = null
  if (phys?.players?.length) {
    const totalM =
      (phys.teams || []).reduce((s: number, tm: any) => s + (tm.distance_total_m || 0), 0) ||
      phys.players.reduce((s: number, p: any) => s + (p.distance_m || 0), 0)
    const top = Math.max(...phys.players.map((p: any) => p.max_speed_kmh || 0))
    real = [
      [L('مسافتِ کل', 'Total distance'), faN((totalM / 1000).toFixed(2)), ' km'],
      [L('بیشینه سرعت', 'Top speed'), faN(Math.round(top * 10) / 10), ' km/h'],
      [L('بازیکنان (Re-ID)', 'Players (Re-ID)'), faN(phys.player_count), ''],
      [L('تعداد اسپرینت', 'Sprints'), faN(phys.sprints ?? 0), ''],
    ]
  }

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {job && real ? (
        <div style={css('margin-bottom:18px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('آخرین ویدیوی آنالیزشده', 'Latest analysed video')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
            <a href="#physical" onClick={(ev) => { ev.preventDefault(); (v as any).go?.('physical') }} style={css('font-size:11.5px;color:var(--ac);text-decoration:none;cursor:pointer')}>{L('آنالیز فیزیکی ←', 'Physical analysis →')}</a>
          </div>
          <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px')}>
            {real.map(([lab, val, unit], i) => (
              <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px')}>
                <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>{lab}</div>
                <div style={css('font-size:24px;font-weight:800')}>{val}<span style={css('font-size:12px;color:var(--mut);font-weight:600')}>{unit}</span></div>
              </div>
            ))}
          </div>
          {(job as any).result?.possession && (job as any).result?.teams && !(job as any).result?.single_team ? (
            <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px 17px;margin-top:14px')}>
              <div style={css('display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:8px')}>
                <span style={css('color:var(--sub)')}>{L('مالکیتِ توپ (واقعی)', 'Ball possession (real)')}</span>
                <span style={css('color:var(--mut)')}>{L('A', 'A')} {faN((job as any).result.possession.a)}٪ · {L('B', 'B')} {faN((job as any).result.possession.b)}٪</span>
              </div>
              <div style={css('height:11px;border-radius:6px;overflow:hidden;display:flex')}>
                <div style={css(`width:${(job as any).result.possession.a}%;background:${(job as any).result.teams[0].color}`)}></div>
                <div style={css(`width:${(job as any).result.possession.b}%;background:${(job as any).result.teams[1].color}`)}></div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز ویدیویی آنالیز نشده. در «کتابخانه ویدیو» یک ویدیو بارگذاری و آنالیز کن تا خلاصه‌ی آخرین آنالیز اینجا بیاید.',
            'No video analysed yet. Upload and analyse a video in “Video Library” and the latest-analysis summary will appear here.')}
        </div>
      )}
    </div>
  )
}
