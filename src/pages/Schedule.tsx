import { useState } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useCollection } from '../lib/useCollection'

type Fixture = { id: string; date: string; type: 'match' | 'training'; opponent: string; note: string }

// Real, persistent fixture list you fill in yourself (matches & training) — no mock.
export function Schedule({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const { rows, update } = useCollection<Fixture>('schedule', [])
  const [d, setD] = useState({ date: '', type: 'match', opponent: '', note: '' })
  const INP = 'height:36px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 10px;outline:none'

  function add() {
    if (!d.date) return
    const id = `${d.date}-${Math.round(Number(String(d.date).replace(/\D/g, '')) % 100000)}-${rows.length}`
    update([...rows, { id, date: d.date, type: d.type as Fixture['type'], opponent: d.opponent, note: d.note }])
    setD({ date: '', type: 'match', opponent: '', note: '' })
  }
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div style={css('max-width:1340px;margin:0 auto')}>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
          <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
          <div style={css('font-weight:800;font-size:15px')}>{L('برنامه‌ی بازی‌ها و تمرین', 'Fixtures & training')}</div>
          <span style={css('font-size:11px;color:var(--mut)')}>{L('خودت وارد کن — ذخیره می‌ماند', 'enter your own — it persists')}</span>
        </div>
        <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px')}>
          <input type="date" value={d.date} onChange={(ev) => setD({ ...d, date: ev.target.value })} style={css(INP)} />
          <select value={d.type} onChange={(ev) => setD({ ...d, type: ev.target.value })} style={css(INP + ';cursor:pointer')}>
            <option value="match">{L('بازی', 'Match')}</option>
            <option value="training">{L('تمرین', 'Training')}</option>
          </select>
          <input placeholder={L('حریف / عنوان', 'Opponent / title')} value={d.opponent} onChange={(ev) => setD({ ...d, opponent: ev.target.value })} style={css(INP + ';flex:1;min-width:140px')} />
          <input placeholder={L('یادداشت', 'Note')} value={d.note} onChange={(ev) => setD({ ...d, note: ev.target.value })} style={css(INP + ';flex:1;min-width:120px')} />
          <button onClick={add} style={css('height:36px;padding:0 16px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer')}>{L('+ افزودن', '+ Add')}</button>
        </div>
        {sorted.length ? (
          <div style={css('display:flex;flex-direction:column;gap:4px')}>
            {sorted.map((f) => (
              <div key={f.id} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:8px 11px')}>
                <span style={css('font-family:monospace;font-size:12px;color:var(--sub);width:96px')}>{f.date}</span>
                <span style={css(`font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px;${f.type === 'match' ? 'background:var(--acd);color:var(--ac)' : 'background:var(--aid);color:var(--ai)'}`)}>{f.type === 'match' ? L('بازی', 'Match') : L('تمرین', 'Training')}</span>
                <span style={css('font-size:12.5px;font-weight:700;flex:1')}>{f.opponent || '—'}</span>
                <span style={css('font-size:11.5px;color:var(--mut)')}>{f.note}</span>
                <Box onClick={() => update(rows.filter((x) => x.id !== f.id))} css="width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer" hover="background:var(--dngd);color:var(--dng)" title={L('حذف', 'Delete')}>✕</Box>
              </div>
            ))}
          </div>
        ) : (
          <div style={css('font-size:12px;color:var(--mut);text-align:center;padding:10px')}>{L('هنوز برنامه‌ای وارد نشده.', 'No fixtures yet.')}</div>
        )}
      </div>
    </div>
  )
}
