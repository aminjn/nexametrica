import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Real — event timeline + top passing combinations from the analysis. No mock.
export function Matrix({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const P = rr.physical?.passes
  const events: any[] = P?.events || []
  const edges: any[] = P?.edges || []
  const nodes: any[] = P?.nodes || []
  const numOf = (id: number) => nodes.find((n) => n.id === id)?.number
  const teamsMeta = rr.teams || []
  const colorOf = (i: number) => teamsMeta[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')
  const dur = rr.video?.duration_sec || (events.length ? events[events.length - 1].t : 1)
  const lbl = (id: number) => (numOf(id) ? `#${faN(numOf(id))}` : `${L('ب', 'P')}${faN(id)}`)

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {events.length || edges.length ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('تایم‌لاین و ماتریسِ پاس', 'Timeline & passing matrix')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          {/* event timeline */}
          <div style={css('font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:8px')}>{L('تایم‌لاینِ رویدادها', 'Event timeline')}</div>
          <div style={css('position:relative;height:26px;background:var(--bg2);border:1px solid var(--bd);border-radius:7px;overflow:hidden;margin-bottom:18px')}>
            {events.map((ev, i) => (
              <div key={i} title={`${ev.type} · ${Math.round(ev.t)}s`}
                style={{ position: 'absolute', top: ev.type === 'pass' ? '5px' : '13px', left: `${Math.min(99, (ev.t / dur) * 100)}%`, width: '3px', height: '8px', borderRadius: '2px', background: colorOf(ev.team), opacity: ev.type === 'pass' ? 0.9 : 0.5 }} />
            ))}
          </div>
          {/* top passing combinations */}
          <div style={css('font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:8px')}>{L('پرتکرارترین پاس‌ها (چه‌کسی به چه‌کسی)', 'Top passing combinations (who → whom)')}</div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:6px')}>
            {edges.slice(0, 16).map((e, i) => (
              <div key={i} style={css('display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:6px 10px')}>
                <span style={css(`width:9px;height:9px;border-radius:3px;background:${colorOf(e.team)}`)}></span>
                <span style={css('font-size:12px;font-weight:700;flex:1')}>{lbl(e.from)} <span style={css('color:var(--mut)')}>→</span> {lbl(e.to)}</span>
                <span style={css('font-size:12px;font-weight:800;color:var(--ac)')}>{faN(e.count)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز رویدادِ واقعی‌ای نیست. یک ویدیوی دوتیمی در «کتابخانه ویدیو» آنالیز کن تا ماتریسِ پاس اینجا بیاید.',
            'No real events yet. Analyse a two-team video in “Video Library” and the passing matrix will appear here.')}
        </div>
      )}
    </div>
  )
}
