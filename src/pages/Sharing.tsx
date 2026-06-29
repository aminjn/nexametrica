import { useState } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useCollection } from '../lib/useCollection'
import { useLatestPhysicalJob } from '../lib/useLatestJob'

type Note = { id: string; author: string; video: string; note: string; ts: string }

// Real — a persistent feedback / notes board the staff fills in, tied to the
// analysed video. Saves to the server. No mock messenger / fake presence.
export function Sharing({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const job = useLatestPhysicalJob()
  const videoName = (job as any)?.name || ''
  const { rows, update } = useCollection<Note>('sharing', [])
  const [d, setD] = useState({ author: '', note: '' })
  const INP = 'height:38px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 12px;outline:none'

  function add() {
    if (!d.note.trim()) return
    const ts = new Date().toLocaleString(fa ? 'fa-IR' : 'en-GB')
    update([{ id: `${rows.length}-${d.note.slice(0, 8)}`, author: d.author || L('کاربر', 'User'), video: videoName, note: d.note, ts }, ...rows])
    setD({ author: d.author, note: '' })
  }

  return (
    <div style={css('max-width:920px;margin:0 auto')}>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap')}>
          <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
          <div style={css('font-weight:800;font-size:15px')}>{L('اشتراک و فیدبکِ کادرِ فنی', 'Staff feedback & notes')}</div>
        </div>
        <div style={css('font-size:11px;color:var(--mut);margin-bottom:14px')}>
          {videoName
            ? L(`یادداشت‌ها به «${videoName}» وصل می‌شوند و ذخیره می‌مانند.`, `Notes attach to “${videoName}” and persist.`)
            : L('یادداشت‌ها ذخیره می‌مانند.', 'Notes persist.')}
        </div>
        <div style={css('display:flex;gap:8px;margin-bottom:10px')}>
          <input placeholder={L('نام (اختیاری)', 'Name (optional)')} value={d.author} onChange={(ev) => setD({ ...d, author: ev.target.value })} style={css(INP + ';width:180px')} />
          <div style={css('flex:1')}></div>
        </div>
        <div style={css('display:flex;gap:8px;align-items:flex-start')}>
          <textarea
            placeholder={L('فیدبک یا یادداشتِ تاکتیکی…', 'Feedback or tactical note…')}
            value={d.note}
            onChange={(ev) => setD({ ...d, note: ev.target.value })}
            onKeyDown={(ev) => { if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') add() }}
            style={css('flex:1;min-height:64px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:10px 12px;outline:none;resize:vertical')}
          />
          <button onClick={add} style={css('height:38px;padding:0 18px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer')}>{L('ثبت', 'Post')}</button>
        </div>
      </div>

      {rows.length ? (
        <div style={css('display:flex;flex-direction:column;gap:10px')}>
          {rows.map((m) => (
            <div key={m.id} style={css('background:var(--card);border:1px solid var(--bd);border-radius:13px;padding:14px 16px')}>
              <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:7px')}>
                <span style={css('width:26px;height:26px;border-radius:50%;background:var(--acd);color:var(--ac);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0')}>{(m.author || '?').slice(0, 1)}</span>
                <span style={css('font-size:12.5px;font-weight:700')}>{m.author}</span>
                {m.video ? <span style={css('font-size:10.5px;color:var(--mut);background:var(--bg2);padding:2px 8px;border-radius:20px')}>{m.video}</span> : null}
                <div style={css('flex:1')}></div>
                <span style={css('font-size:10.5px;color:var(--mut)')}>{m.ts}</span>
                <Box onClick={() => update(rows.filter((x) => x.id !== m.id))} css="width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer" hover="background:var(--dngd);color:var(--dng)" title={L('حذف', 'Delete')}>✕</Box>
              </div>
              <div style={css('font-size:12.5px;color:#cdd2d8;line-height:1.7;white-space:pre-wrap')}>{m.note}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={css('font-size:12px;color:var(--mut);text-align:center;padding:14px')}>{L('هنوز فیدبکی ثبت نشده.', 'No feedback yet.')}</div>
      )}
    </div>
  )
}
