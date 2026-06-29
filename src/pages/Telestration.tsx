import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { TelestrationCanvas } from '../components/TelestrationCanvas'

// Real — draw arrows/lines on the latest analysed keyframe. No mock.
export function Telestration({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const frame: string | undefined = rr.calibration_check || rr.keyframe || (rr.keyframes && rr.keyframes[0])

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {frame ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('رسم روی فریمِ آنالیز', 'Draw on the analysed frame')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          <TelestrationCanvas src={frame} fa={fa} />
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز فریمِ آنالیزشده‌ای نیست. یک ویدیو در «کتابخانه ویدیو» آنالیز کن تا اینجا رویش رسم کنی.',
            'No analysed frame yet. Analyse a video in “Video Library” to draw on it.')}
        </div>
      )}
    </div>
  )
}
