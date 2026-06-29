import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Real — the actual CV models + the latest video's processing facts. No mock.
export function Model({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const vid = rr.video
  const phys = rr.physical

  const pipeline = job ? [
    { n: L('تشخیص (YOLO11)', 'Detection (YOLO11)'), ok: true, info: rr.model || 'yolo11m.pt' },
    { n: L('ردیابی (ByteTrack)', 'Tracking (ByteTrack)'), ok: !!rr.players, info: `${faN(rr.players?.unique_tracks ?? 0)} ${L('رد', 'tracks')}` },
    { n: L('تفکیکِ تیم (رنگ پیراهن)', 'Team split (jersey colour)'), ok: !!rr.teams, info: rr.single_team ? L('تک‌تیم', 'single kit') : L('دو تیم', 'two teams') },
    { n: L('کالیبراسیونِ زمین', 'Pitch calibration'), ok: !!rr.calibration_auto, info: rr.calibration_auto ? L('خودکار', 'automatic') : L('غیرفعال', 'off') },
    { n: L('Re-ID (اتصالِ ردها)', 'Re-ID (track stitching)'), ok: !!phys?.player_count, info: phys ? `${faN(phys.player_count)} ${L('بازیکن', 'players')}` : '—' },
    { n: L('شماره‌ی پیراهن (OCR)', 'Jersey OCR'), ok: !!phys?.numbered, info: phys?.numbered ? `${faN(phys.numbered)} ${L('خوانده‌شد', 'read')}` : L('غیرفعال/۰', 'off / 0') },
    { n: L('مالکیت و پاس', 'Possession & passes'), ok: !!rr.possession, info: rr.possession ? `${faN(rr.possession.a)}٪/${faN(rr.possession.b)}٪` : '—' },
  ] : []

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {job ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('وضعیتِ خطِ پردازشِ بینایی', 'Vision pipeline status')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          {vid ? (
            <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:12px')}>
              {faN(vid.width)}×{faN(vid.height)} · {faN(vid.fps)}fps · {faN(rr.processed_frames)} {L('فریمِ پردازش‌شده', 'frames processed')}
              {vid.duration_sec ? ` · ${faN(Math.round(vid.duration_sec))}${L('ث', 's')}` : ''}
            </div>
          ) : null}
          <div style={css('display:flex;flex-direction:column;gap:6px')}>
            {pipeline.map((s, i) => (
              <div key={i} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:9px;padding:9px 12px')}>
                <span style={css(`width:9px;height:9px;border-radius:50%;background:${s.ok ? 'var(--good)' : 'var(--mut)'}`)}></span>
                <span style={css('font-size:12.5px;font-weight:700;flex:1')}>{s.n}</span>
                <span style={css('font-size:11.5px;color:var(--mut)')}>{s.info}</span>
                <span style={css(`font-size:10.5px;font-weight:700;color:${s.ok ? 'var(--good)' : 'var(--mut)'}`)}>{s.ok ? L('فعال', 'active') : L('—', '—')}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز ویدیویی آنالیز نشده. در «کتابخانه ویدیو» یک ویدیو آنالیز کن تا وضعیتِ خطِ پردازش اینجا بیاید.',
            'No video analysed yet. Analyse one in “Video Library” and the pipeline status will appear here.')}
        </div>
      )}
    </div>
  )
}
