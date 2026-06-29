import { useState } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { useCollection } from '../lib/useCollection'
import { eng } from '../engine'

type Bookmark = { id: string; video: string; time: string; label: string; type: string }

// Real — key moments auto-detected in the latest analysis (timestamped passes /
// recoveries) plus a persistent bookmark list you build yourself. No mock.
export function Clips({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const events: any[] = rr.physical?.passes?.events || []
  const teamsMeta = rr.teams || []
  const colorOf = (i: number) => teamsMeta[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const { rows, update } = useCollection<Bookmark>('clips', [])
  const [d, setD] = useState({ time: '', label: '', type: 'goal' })
  const INP = 'height:36px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 10px;outline:none'
  const videoName = (job as any)?.name || ''

  function add() {
    if (!d.label) return
    update([...rows, { id: `${rows.length}-${d.time}-${d.label}`, video: videoName, time: d.time, label: d.label, type: d.type }])
    setD({ time: '', label: '', type: 'goal' })
  }
  function addFromEvent(ev: any) {
    const time = mmss(ev.t)
    const label = ev.type === 'pass' ? L('پاس کلیدی', 'Key pass') : L('توپ‌ربایی', 'Recovery')
    update([...rows, { id: `${time}-${label}-${rows.length}`, video: videoName, time, label, type: ev.type }])
  }

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {/* persistent bookmarks */}
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
          <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
          <div style={css('font-weight:800;font-size:15px')}>{L('پلی‌لیستِ لحظاتِ کلیدی', 'Key-moments playlist')}</div>
          <span style={css('font-size:11px;color:var(--mut)')}>{L('بوکمارک‌ها ذخیره می‌مانند', 'bookmarks persist')}</span>
        </div>
        <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px')}>
          <input placeholder={L('زمان (مثلاً 38:12)', 'Time (e.g. 38:12)')} value={d.time} onChange={(ev) => setD({ ...d, time: ev.target.value })} style={css(INP + ';width:150px')} />
          <input placeholder={L('عنوانِ لحظه', 'Moment title')} value={d.label} onChange={(ev) => setD({ ...d, label: ev.target.value })} style={css(INP + ';flex:1;min-width:160px')} />
          <select value={d.type} onChange={(ev) => setD({ ...d, type: ev.target.value })} style={css(INP + ';cursor:pointer')}>
            <option value="goal">{L('گل', 'Goal')}</option>
            <option value="pass">{L('پاس', 'Pass')}</option>
            <option value="recovery">{L('توپ‌ربایی', 'Recovery')}</option>
            <option value="chance">{L('موقعیت', 'Chance')}</option>
            <option value="other">{L('سایر', 'Other')}</option>
          </select>
          <button onClick={add} style={css('height:36px;padding:0 16px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer')}>{L('+ افزودن', '+ Add')}</button>
        </div>
        {rows.length ? (
          <div style={css('display:flex;flex-direction:column;gap:4px')}>
            {rows.map((c) => (
              <div key={c.id} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:8px 11px')}>
                <span style={css('font-family:monospace;font-size:12px;color:var(--ac);width:60px;font-weight:700')}>{c.time || '—'}</span>
                <span style={css('font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:20px;background:var(--acd);color:var(--ac)')}>{c.type}</span>
                <span style={css('font-size:12.5px;font-weight:700;flex:1')}>{c.label}</span>
                <span style={css('font-size:11px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px')}>{c.video}</span>
                <Box onClick={() => update(rows.filter((x) => x.id !== c.id))} css="width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer" hover="background:var(--dngd);color:var(--dng)" title={L('حذف', 'Delete')}>✕</Box>
              </div>
            ))}
          </div>
        ) : (
          <div style={css('font-size:12px;color:var(--mut);text-align:center;padding:10px')}>{L('هنوز لحظه‌ای ذخیره نشده.', 'No moments saved yet.')}</div>
        )}
      </div>

      {/* auto-detected moments from the latest analysis */}
      {events.length ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('خودکار از آنالیز', 'Auto from analysis')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('لحظاتِ تشخیص‌داده‌شده', 'Detected moments')}</div>
            <span style={css('font-size:11px;color:var(--mut)')}>· {videoName} · {faN(events.length)} {L('رویداد', 'events')}</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:3px;max-height:380px;overflow:auto')}>
            {events.map((ev, i) => (
              <div key={i} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:7px 11px')}>
                <span style={css('font-family:monospace;font-size:11.5px;color:var(--mut);width:48px')}>{mmss(ev.t)}</span>
                <span style={css(`width:9px;height:9px;border-radius:3px;background:${colorOf(ev.team)}`)}></span>
                <span style={css(`font-size:11px;font-weight:700;width:80px;color:${ev.type === 'pass' ? 'var(--ac)' : 'var(--warn)'}`)}>{ev.type === 'pass' ? L('پاس', 'Pass') : L('توپ‌ربایی', 'Recovery')}</span>
                <div style={css('flex:1')}></div>
                <button onClick={() => addFromEvent(ev)} style={css('height:28px;padding:0 11px;background:var(--card2);border:1px solid var(--bd2);border-radius:7px;color:var(--ac);font-family:inherit;font-size:11px;font-weight:700;cursor:pointer')}>{L('+ به پلی‌لیست', '+ to playlist')}</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('برای لحظاتِ خودکار، یک ویدیوی دوتیمی در «کتابخانه ویدیو» آنالیز کن.',
            'For auto moments, analyse a two-team video in “Video Library”.')}
        </div>
      )}
    </div>
  )
}
