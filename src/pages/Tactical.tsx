import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { Heatmap } from '../components/Heatmap'
import { PassNetwork } from '../components/PassNetwork'
import { eng } from '../engine'

// Real tactical analysis — driven by the latest analysed video (possession, passes,
// passing network, metric heatmap). The old prototype mock (xG/xT/xA, fake formation)
// was removed; those need trained event models and reliable footage.
export function Tactical({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const single = !!rr.single_team || !!(job as any)?.single_override
  const hasReal = !!(rr.pitch_heatmap_a || rr.pitch_heatmap)
  const colorOf = (i: number) => rr.teams?.[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')
  const poss = rr.possession
  const passes = rr.physical?.passes
  const twoTeam = rr.teams && !single

  if (!job || !hasReal) {
    return (
      <div style={css('max-width:1320px;margin:0 auto')}>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px;font-size:13px;color:var(--mut);line-height:1.9')}>
          {L('هنوز آنالیزِ تاکتیکیِ واقعی‌ای نیست. در «کتابخانه ویدیو» یک ویدیوی دوتیمی آپلود کن تا این صفحه با داده‌ی واقعی پر شود.',
            'No real tactical analysis yet. Upload a two-team video in “Video Library” and this page fills with real data.')}
        </div>
      </div>
    )
  }

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
        <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
        <div style={css('font-weight:800;font-size:15px')}>{L('آنالیزِ تاکتیکیِ واقعی', 'Real tactical analysis')}</div>
        <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
      </div>

      {/* real tactical metric cards */}
      {twoTeam && (poss || passes) ? (
        <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:16px')}>
          <Card lab={L('مالکیتِ توپ', 'Possession')} val={poss ? `${faN(poss.a)}٪–${faN(poss.b)}٪` : '—'} sub={L('A–B', 'A–B')} />
          <Card lab={L('پاسِ موفق', 'Completed passes')} val={passes ? faN(passes.total) : '—'} sub={passes ? `A ${faN(passes.a)} · B ${faN(passes.b)}` : ''} />
          <Card lab={L('دقتِ پاس', 'Pass accuracy')} val={passes?.acc_a != null ? `${faN(passes.acc_a)}٪–${faN(passes.acc_b)}٪` : '—'} sub={L('A–B', 'A–B')} />
          <Card lab={L('توپ‌رباییِ تیم A', 'Team A recoveries')} val={passes ? faN(passes.recov_a ?? 0) : '—'} sub={passes ? `B: ${faN(passes.recov_b ?? 0)}` : ''} />
        </div>
      ) : null}

      {/* possession bar */}
      {twoTeam && poss ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px 17px;margin-bottom:16px')}>
          <div style={css('display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:8px')}>
            <span style={css('color:var(--sub)')}>{L('مالکیتِ توپ', 'Ball possession')}</span>
            <span style={css('color:var(--mut)')}>A {faN(poss.a)}٪ · B {faN(poss.b)}٪</span>
          </div>
          <div style={css('height:11px;border-radius:6px;overflow:hidden;display:flex')}>
            <div style={css(`width:${poss.a}%;background:${colorOf(0)}`)}></div>
            <div style={css(`width:${poss.b}%;background:${colorOf(1)}`)}></div>
          </div>
        </div>
      ) : null}

      {/* real metric heatmap */}
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
        <div style={css('font-weight:800;font-size:14px;margin-bottom:12px')}>{L('نقشه‌ی حرارتیِ تاپ‌ویوِ واقعی (متر)', 'Real top-down heatmap (metres)')}</div>
        {rr.pitch_heatmap_a && rr.pitch_heatmap_b && !single ? (
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
            <div>
              <div style={css('font-size:11px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px')}><span style={css(`width:11px;height:11px;border-radius:3px;background:${colorOf(0)}`)}></span>{L('تیم A', 'Team A')}</div>
              <Heatmap grid={rr.pitch_heatmap_a} />
            </div>
            <div>
              <div style={css('font-size:11px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px')}><span style={css(`width:11px;height:11px;border-radius:3px;background:${colorOf(1)}`)}></span>{L('تیم B', 'Team B')}</div>
              <Heatmap grid={rr.pitch_heatmap_b} />
            </div>
          </div>
        ) : (
          <Heatmap grid={rr.pitch_heatmap_a || rr.pitch_heatmap} />
        )}
      </div>

      {/* real passing network */}
      {passes?.total > 0 && twoTeam ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('font-weight:800;font-size:14px;margin-bottom:4px')}>{L('شبکه‌ی پاس', 'Passing network')}</div>
          <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:14px')}>
            {L('گره = موقعیتِ میانگینِ بازیکن · خط = تعدادِ پاس بینِ دو هم‌تیمی', 'Node = average position · line = pass count between teammates')}
          </div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
            <PassNetwork nodes={passes.nodes || []} edges={passes.edges || []} team={0} color={colorOf(0)} label={L('تیم A', 'Team A')} />
            <PassNetwork nodes={passes.nodes || []} edges={passes.edges || []} team={1} color={colorOf(1)} label={L('تیم B', 'Team B')} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Card({ lab, val, sub }: { lab: string; val: string; sub?: string }) {
  return (
    <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px')}>
      <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>{lab}</div>
      <div style={css('font-size:22px;font-weight:800')}>{val}</div>
      {sub ? <div style={css('font-size:10.5px;color:var(--mut);margin-top:4px')}>{sub}</div> : null}
    </div>
  )
}
