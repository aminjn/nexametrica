import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { Physical as RealPhysical } from '../components/Physical'
import { eng } from '../engine'

// Ported from prototype lines 521–569. vm = v.vm (engine.vm_physical()).
// The top block is REAL — it pulls the latest analysed video's physical stats.
export function Physical({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const phys = (job as any)?.result?.physical

  // real aggregate KPIs from the latest analysed video
  let kpi: { distKm: string; top: number; players: number; mins: number } | null = null
  if (phys?.players?.length) {
    const totalM = (phys.teams || []).reduce((s: number, tm: any) => s + (tm.distance_total_m || 0), 0)
      || phys.players.reduce((s: number, p: any) => s + (p.distance_m || 0), 0)
    const top = Math.max(...phys.players.map((p: any) => p.max_speed_kmh || 0))
    const secs = Math.max(...phys.players.map((p: any) => p.seconds || 0))
    kpi = { distKm: (totalM / 1000).toFixed(2), top: Math.round(top * 10) / 10, players: phys.player_count, mins: Math.round(secs / 60) }
  }

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {job && phys ? (
        <div style={css('margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('آخرین آنالیزِ واقعی', 'Latest real analysis')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          {kpi ? (
            <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:14px')}>
              {[
                [L('مسافتِ کل (همه‌ی بازیکنان)', 'Total distance (all players)'), `${faN(kpi.distKm)}`, ' km'],
                [L('بیشینه سرعت', 'Top speed'), `${faN(kpi.top)}`, ' km/h'],
                [L('بازیکنان (Re-ID)', 'Players (Re-ID)'), `${faN(kpi.players)}`, ''],
                [L('بازه‌ی ردیابی', 'Tracked span'), `${faN(kpi.mins)}`, ' min'],
              ].map(([lab, val, unit], i) => (
                <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px')}>
                  <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>{lab as string}</div>
                  <div style={css('font-size:23px;font-weight:800')}>{val as string}<span style={css('font-size:13px;color:var(--mut);font-weight:600')}>{unit as string}</span></div>
                </div>
              ))}
            </div>
          ) : null}
          <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:4px 16px 16px')}>
            <RealPhysical v={v} job={job} />
          </div>
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز آنالیزِ واقعی‌ای نیست. در «کتابخانه ویدیو» یک ویدیوی پیوسته آپلود کن تا این بخش با داده‌ی واقعی پر شود. نمونه‌ی زیر دموی طراحی است.',
            'No real analysis yet. Upload a continuous video in “Video Library” to fill this with real data. The sample below is a design demo.')}
        </div>
      )}

      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
      </div>
      <div style={css('display:grid;grid-template-columns:repeat(5,1fr);gap:13px;margin-bottom:14px')}>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px')}>
          <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>{t.distance}</div>
          <div style={css('font-size:23px;font-weight:800')}>۱۱٫۴<span style={css('font-size:13px;color:var(--mut);font-weight:600')}> km</span></div>
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px')}>
          <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>{t.sprints}</div>
          <div style={css('font-size:23px;font-weight:800;color:var(--ac)')}>۴۱</div>
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px')}>
          <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>{t.topSpeed}</div>
          <div style={css('font-size:23px;font-weight:800')}>۳۴٫۲<span style={css('font-size:13px;color:var(--mut);font-weight:600')}> km/h</span></div>
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px')}>
          <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>{t.accelDecel}</div>
          <div style={css('font-size:23px;font-weight:800')}>۶۸<span style={css('font-size:13px;color:var(--mut);font-weight:600')}> ×</span></div>
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px')}>
          <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>{t.workload}</div>
          <div style={css('font-size:23px;font-weight:800;color:var(--warn)')}>۹۲<span style={css('font-size:13px;color:var(--mut);font-weight:600')}> AU</span></div>
        </div>
      </div>
      <div style={css('display:grid;grid-template-columns:1fr 1.3fr;gap:14px;margin-bottom:14px')}>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{t.speedZones}</div>
          {vm.zones}
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:6px')}>{t.workloadTrend}</div>
          <div style={css('font-size:11px;color:var(--mut);margin-bottom:10px')}>۸ {t.matches}</div>
          {vm.workload}
        </div>
      </div>
      <div style={css('display:grid;grid-template-columns:1.1fr 1fr;gap:14px')}>
        <div style={css('background:linear-gradient(150deg,rgba(239,68,68,.07),var(--card) 60%);border:1px solid rgba(239,68,68,.25);border-radius:14px;padding:18px')}>
          <div style={css('display:flex;align-items:center;gap:9px;margin-bottom:14px')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--dng)" strokeWidth="2" strokeLinecap="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" /></svg>
            <div style={css('font-weight:700;font-size:14px')}>{t.injuryRisk}</div>
            <span style={css('margin-inline-start:auto;display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:var(--ai);background:var(--aid);padding:2px 8px;border-radius:20px')}><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" /></svg>AI</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:11px')}>
            {vm.risk.map((r: any, i: number) => (
              <div key={i}>
                <div style={css('display:flex;align-items:center;gap:12px')}>
                  <div style={css('font-size:13px;font-weight:600;min-width:96px')}>{r.n}</div>
                  <div style={css('flex:1;height:7px;background:var(--raised);border-radius:6px;overflow:hidden')}><div style={css(`height:100%;width:${r.pct};background:${r.c};border-radius:6px`)}></div></div>
                  <div style={css('font-family:monospace;font-size:12px;color:var(--sub);min-width:38px')}>{r.acwr}</div>
                  <span style={css(`font-size:10.5px;font-weight:700;color:${r.c};background:${r.b};padding:3px 9px;border-radius:20px;min-width:54px;text-align:center`)}>{r.lbl}</span>
                  <button onClick={r.onWhy} title={r.whyLabel} style={css('width:24px;height:24px;border-radius:7px;background:var(--aid);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ai);flex-shrink:0')}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3M12 17h.01" strokeLinecap="round" /></svg></button>
                </div>
                {r.open ? (
                  <div style={css('margin-top:8px;margin-inline-start:108px;padding:10px 12px;background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.18);border-radius:9px;font-size:11.5px;color:#aeb6bf;line-height:1.7')}>{r.explain}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{t.player} · {t.loadIdx}</div>
          <div style={css('display:flex;flex-direction:column;gap:2px')}>
            <div style={css('display:flex;font-size:11px;color:var(--mut);padding:0 10px 8px;font-weight:700')}><span style={css('flex:1')}>{t.player}</span><span style={css('width:64px;text-align:center')}>{t.distance}</span><span style={css('width:50px;text-align:center')}>{t.sprints}</span><span style={css('width:50px;text-align:center')}>{t.loadIdx}</span></div>
            {vm.tbl.map((row: any, i: number) => (
              <Box key={i} css="display:flex;align-items:center;font-size:12.5px;padding:8px 10px;border-radius:8px" hover="background:var(--bg2)"><span style={css('flex:1;font-weight:600')}>{row.n}</span><span style={css('width:64px;text-align:center;font-family:monospace')}>{row.dist}</span><span style={css('width:50px;text-align:center;font-family:monospace')}>{row.sp}</span><span style={css('width:50px;text-align:center;font-family:monospace;color:var(--ac);font-weight:700')}>{row.load}</span></Box>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
