import { useEffect, useState } from 'react'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { listJobs, generateReport, type Job } from '../api'
import { eng } from '../engine'

// Real team dashboard: latest-analysis KPIs, a cross-video comparison, an
// aggregate team summary, recent sessions, and an on-demand AI insight — all
// computed from real analysed videos. No mock.
export function Dashboard({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const phys = (job as any)?.result?.physical

  const [jobs, setJobs] = useState<Job[]>([])
  useEffect(() => { listJobs().then((r) => setJobs(r.jobs || [])).catch(() => {}) }, [])
  const done = jobs.filter((j) => j.status === 'done' && (j as any).result?.physical)

  // latest KPI strip
  let real: [string, string, string][] | null = null
  if (phys?.players?.length) {
    const totalM = (phys.teams || []).reduce((s: number, tm: any) => s + (tm.distance_total_m || 0), 0)
      || phys.players.reduce((s: number, p: any) => s + (p.distance_m || 0), 0)
    const top = Math.max(...phys.players.map((p: any) => p.max_speed_kmh || 0))
    real = [
      [L('مسافتِ کل', 'Total distance'), faN((totalM / 1000).toFixed(2)), ' km'],
      [L('بیشینه سرعت', 'Top speed'), faN(Math.round(top * 10) / 10), ' km/h'],
      [L('بازیکنان (Re-ID)', 'Players (Re-ID)'), faN(phys.player_count), ''],
      [L('تعداد اسپرینت', 'Sprints'), faN(phys.sprints ?? 0), ''],
    ]
  }

  // aggregate team summary across all analysed videos
  const agg = done.reduce(
    (a, j) => {
      const r: any = j.result
      const p = r.physical || {}
      const dist = (p.teams || []).reduce((s: number, tm: any) => s + (tm.distance_total_m || 0), 0)
        || (p.players || []).reduce((s: number, x: any) => s + (x.distance_m || 0), 0)
      a.dist += dist
      a.sprints += p.sprints || 0
      a.top = Math.max(a.top, ...(p.players || []).map((x: any) => x.max_speed_kmh || 0))
      a.secs += r.video?.duration_sec || 0
      return a
    },
    { dist: 0, sprints: 0, top: 0, secs: 0 },
  )

  // AI insight (LLM-backed, on demand)
  const [insight, setInsight] = useState('')
  const [busy, setBusy] = useState(false)
  async function genInsight() {
    if (!job || busy) return
    setBusy(true); setInsight('')
    const r: any = (job as any).result || {}
    const p = r.physical || {}
    const ctx = [
      `video: ${(job as any).name}`,
      r.possession ? `possession A/B: ${r.possession.a}%/${r.possession.b}%` : '',
      p.passes ? `passes A/B: ${p.passes.a}/${p.passes.b}` : '',
      `players: ${p.player_count}, sprints: ${p.sprints}`,
      (p.teams || []).map((t: any) => `team ${t.team === 0 ? 'A' : 'B'}: dist ${t.distance_total_m}m, top ${t.top_speed_kmh}km/h`).join('; '),
    ].filter(Boolean).join('\n')
    try {
      setInsight(await generateReport({ context: ctx } as any, v.lang))
    } catch {
      setInsight(L('بینش تولید نشد — سرویسِ AI تنظیم نشده؟ (پنلِ مدیریت → ارائه‌دهنده‌ها).', 'Insight failed — AI provider not set? (Super admin → providers).'))
    } finally { setBusy(false) }
  }

  const CARD = 'background:var(--card);border:1px solid var(--bd);border-radius:14px'

  if (!job || !real) {
    return (
      <div style={css('max-width:1320px;margin:0 auto')}>
        <div style={css(CARD + ';padding:18px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز ویدیویی آنالیز نشده. در «کتابخانه ویدیو» یک ویدیو بارگذاری و آنالیز کن تا داشبورد پر شود.',
            'No video analysed yet. Upload & analyse one in “Video Library” to fill the dashboard.')}
        </div>
      </div>
    )
  }
  const rr: any = (job as any).result

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {/* latest analysis KPIs */}
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap')}>
        <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
        <div style={css('font-weight:800;font-size:15px')}>{L('آخرین ویدیوی آنالیزشده', 'Latest analysed video')}</div>
        <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
        <a href="#physical" onClick={(ev) => { ev.preventDefault(); (v as any).go?.('physical') }} style={css('font-size:11.5px;color:var(--ac);text-decoration:none;cursor:pointer')}>{L('آنالیز فیزیکی ←', 'Physical analysis →')}</a>
      </div>
      <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px')}>
        {real.map(([lab, val, unit], i) => (
          <div key={i} style={css(CARD + ';padding:16px 17px')}>
            <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>{lab}</div>
            <div style={css('font-size:24px;font-weight:800')}>{val}<span style={css('font-size:12px;color:var(--mut);font-weight:600')}>{unit}</span></div>
          </div>
        ))}
      </div>
      {rr.possession && rr.teams && !rr.single_team ? (
        <div style={css(CARD + ';padding:14px 17px;margin-bottom:18px')}>
          <div style={css('display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:8px')}>
            <span style={css('color:var(--sub)')}>{L('مالکیتِ توپ (واقعی)', 'Ball possession (real)')}</span>
            <span style={css('color:var(--mut)')}>A {faN(rr.possession.a)}٪ · B {faN(rr.possession.b)}٪</span>
          </div>
          <div style={css('height:11px;border-radius:6px;overflow:hidden;display:flex')}>
            <div style={css(`width:${rr.possession.a}%;background:${rr.teams[0].color}`)}></div>
            <div style={css(`width:${rr.possession.b}%;background:${rr.teams[1].color}`)}></div>
          </div>
        </div>
      ) : null}

      <div style={css('display:grid;grid-template-columns:1.5fr 1fr;gap:14px;margin-bottom:14px')}>
        {/* cross-video comparison */}
        <div style={css(CARD + ';padding:18px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:4px')}>{L('مقایسهٔ بازی‌های آنالیزشده', 'Analysed games — comparison')}</div>
          <div style={css('font-size:11px;color:var(--mut);margin-bottom:14px')}>{L('از روی دادهٔ واقعیِ هر ویدیو', 'from each video’s real data')}</div>
          <div style={css('display:flex;font-size:10.5px;color:var(--mut);font-weight:700;padding:0 4px 8px')}>
            <span style={css('flex:1')}>{L('ویدیو', 'Video')}</span>
            <span style={css('width:120px;text-align:center')}>{L('مالکیت A/B', 'Poss A/B')}</span>
            <span style={css('width:70px;text-align:center')}>{L('بازیکن', 'Players')}</span>
            <span style={css('width:80px;text-align:center')}>{L('بیشینه', 'Top')}</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:4px;max-height:300px;overflow:auto')}>
            {done.map((j) => {
              const r: any = j.result, p = r.physical || {}
              const top = Math.max(0, ...(p.players || []).map((x: any) => x.max_speed_kmh || 0))
              return (
                <div key={j.id} style={css('display:flex;align-items:center;font-size:12px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:8px 11px')}>
                  <span style={css('flex:1;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-inline-end:6px')}>{j.name}</span>
                  <span style={css('width:120px;text-align:center')}>
                    {r.possession && !r.single_team ? (
                      <span style={css('display:inline-flex;width:90px;height:8px;border-radius:5px;overflow:hidden')}>
                        <span style={css(`width:${r.possession.a}%;background:${r.teams?.[0]?.color || 'var(--ac)'}`)}></span>
                        <span style={css(`width:${r.possession.b}%;background:${r.teams?.[1]?.color || 'var(--mut)'}`)}></span>
                      </span>
                    ) : <span style={css('color:var(--mut)')}>—</span>}
                  </span>
                  <span style={css('width:70px;text-align:center;font-family:monospace')}>{faN(p.player_count ?? 0)}</span>
                  <span style={css('width:80px;text-align:center;font-family:monospace')}>{faN(Math.round(top * 10) / 10)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI insight (LLM-backed) */}
        <div style={css('background:linear-gradient(160deg,rgba(56,189,248,.07),var(--card) 55%);border:1px solid rgba(56,189,248,.2);border-radius:14px;padding:18px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px')}>
            <span style={css('display:flex;align-items:center;gap:6px;background:var(--aid);color:var(--ai);font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" /></svg>
              {L('بینشِ هوشِ مصنوعی', 'AI insight')}
            </span>
            <div style={css('flex:1')}></div>
            <button onClick={genInsight} disabled={busy} style={css(`height:32px;padding:0 13px;background:${busy ? 'var(--card2)' : 'var(--ai)'};border:none;border-radius:8px;color:${busy ? 'var(--mut)' : '#06141f'};font-family:inherit;font-size:11.5px;font-weight:800;cursor:${busy ? 'default' : 'pointer'}`)}>
              {busy ? L('در حال نوشتن…', 'Writing…') : L('تولید', 'Generate')}
            </button>
          </div>
          {insight ? (
            <div style={css('font-size:12.5px;color:#cdd2d8;line-height:1.8;white-space:pre-wrap;max-height:300px;overflow:auto')}>{insight}</div>
          ) : (
            <div style={css('font-size:12px;color:var(--mut);line-height:1.7')}>
              {L('روی «تولید» بزن تا از روی دادهٔ واقعیِ آخرین آنالیز یک تحلیلِ کوتاه بنویسد.',
                'Hit “Generate” for a short analysis written from the latest analysis’s real data.')}
            </div>
          )}
        </div>
      </div>

      {/* team aggregate + recent sessions */}
      <div style={css('display:grid;grid-template-columns:1fr 1.4fr;gap:14px')}>
        <div style={css(CARD + ';padding:18px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{L('خلاصهٔ تیم (همهٔ آنالیزها)', 'Team summary (all analyses)')}</div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:10px')}>
            {([
              [L('بازی‌های آنالیزشده', 'Games analysed'), faN(done.length)],
              [L('مسافتِ کل', 'Total distance'), `${faN((agg.dist / 1000).toFixed(1))} km`],
              [L('مجموعِ اسپرینت', 'Total sprints'), faN(agg.sprints)],
              [L('بیشینه سرعت', 'Top speed'), `${faN(Math.round(agg.top * 10) / 10)} km/h`],
            ] as [string, string][]).map(([k, val], i) => (
              <div key={i} style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:12px 13px')}>
                <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:5px')}>{k}</div>
                <div style={css('font-size:18px;font-weight:800')}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={css(CARD + ';padding:18px')}>
          <div style={css('display:flex;align-items:center;margin-bottom:14px')}>
            <div style={css('font-weight:700;font-size:14px')}>{L('جلساتِ اخیر', 'Recent sessions')}</div>
            <div style={css('flex:1')}></div>
            <a href="#library" onClick={(ev) => { ev.preventDefault(); (v as any).go?.('library') }} style={css('font-size:12px;color:var(--ac);text-decoration:none;cursor:pointer')}>{L('همه ←', 'View all →')}</a>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            {jobs.slice(0, 6).map((j) => {
              const c = j.status === 'done' ? 'var(--good)' : j.status === 'failed' ? 'var(--dng)' : 'var(--ai)'
              return (
                <div key={j.id} style={css('display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--bg2);border-radius:10px')}>
                  <span style={css(`width:8px;height:8px;border-radius:50%;background:${c};flex-shrink:0`)}></span>
                  <div style={css('flex:1;min-width:0')}>
                    <div style={css('font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{j.name}</div>
                    <div style={css('font-size:10.5px;color:var(--mut)')}>{(j as any).result?.physical?.player_count ? `${faN((j as any).result.physical.player_count)} ${L('بازیکن', 'players')}` : (j.source === 'worker' ? L('پردازشِ محلی', 'local') : L('آپلودِ سایت', 'upload'))}</div>
                  </div>
                  <span style={css(`font-family:monospace;font-size:10.5px;font-weight:700;color:${c}`)}>{j.status === 'done' ? L('آماده', 'done') : j.status === 'failed' ? L('خطا', 'error') : L('پردازش', 'proc')}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
