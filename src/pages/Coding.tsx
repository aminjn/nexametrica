import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Real — the detected event log (passes/recoveries) from the analysis. No mock.
export function Coding({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const events = (rr.physical?.passes?.events as any[]) || []
  const teamsMeta = rr.teams || []
  const colorOf = (i: number) => teamsMeta[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {events.length ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('رویدادهای تشخیص‌داده‌شده', 'Detected events')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {faN(events.length)} {L('رویداد', 'events')}</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:3px;max-height:440px;overflow:auto')}>
            {events.map((ev: any, i: number) => (
              <div key={i} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:7px 11px')}>
                <span style={css('font-family:monospace;font-size:11.5px;color:var(--mut);width:48px')}>{mmss(ev.t)}</span>
                <span style={css(`width:10px;height:10px;border-radius:3px;background:${colorOf(ev.team)}`)}></span>
                <span style={css(`font-size:11px;font-weight:700;color:${ev.type === 'pass' ? 'var(--ac)' : 'var(--warn)'};width:74px`)}>
                  {ev.type === 'pass' ? L('پاس', 'Pass') : L('توپ‌ربایی', 'Recovery')}
                </span>
                <span style={css('font-size:12px;color:var(--sub);flex:1')}>
                  {ev.type === 'pass' && ev.from && ev.to
                    ? `${L('بازیکن', 'P')} ${faN(ev.from)} ← ${L('بازیکن', 'P')} ${faN(ev.to)}`
                    : `${L('تیم', 'Team')} ${ev.team === 0 ? 'A' : 'B'}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز رویدادِ واقعی‌ای نیست. یک ویدیوی دوتیمی در «کتابخانه ویدیو» آنالیز کن تا رویدادها اینجا بیایند.',
            'No real events yet. Analyse a two-team video in “Video Library” and events will appear here.')}
        </div>
      )}
    </div>
  )
}
