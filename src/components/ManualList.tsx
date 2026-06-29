// Reusable real-data block: an add-form + persistent list + delete, backed by a
// userdata collection. Used by the manual-entry pages (training, nutrition,
// scouting, transfer, …). Real, persistent data with an honest "Real data" badge.
import { useState } from 'react'
import { css } from '../lib/css'
import { Box } from './Box'
import { useCollection } from '../lib/useCollection'

export type Field = {
  key: string
  ph: string
  width?: string
  type?: 'text' | 'date' | 'select'
  options?: [string, string][] // [value, label]
  digits?: boolean
}

export function ManualList({
  v, collection, title, hint, fields, fa: _fa,
}: { v: Record<string, any>; collection: string; title: string; hint?: string; fields: Field[]; fa?: boolean }) {
  const fa = v.lang === 'fa'
  const L = (f: string, e: string) => (fa ? f : e)
  const { rows, update } = useCollection<Record<string, string>>(collection, [])
  const [d, setD] = useState<Record<string, string>>({})
  const INP = 'height:36px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 10px;outline:none'

  function add() {
    if (!d[fields[0].key]) return
    update([...rows, { id: `${collection}-${rows.length}-${(d[fields[0].key] || '').slice(0, 12)}`, ...d }])
    setD({})
  }

  return (
    <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap')}>
        <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
        <div style={css('font-weight:800;font-size:15px')}>{title}</div>
        {hint ? <span style={css('font-size:11px;color:var(--mut)')}>{hint}</span> : null}
      </div>
      <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 14px')}>
        {fields.map((f) =>
          f.type === 'select' ? (
            <select key={f.key} value={d[f.key] || ''} onChange={(e) => setD({ ...d, [f.key]: e.target.value })}
              style={css(INP + `;cursor:pointer;${f.width ? 'width:' + f.width : 'flex:1;min-width:120px'}`)}>
              <option value="">{f.ph}</option>
              {(f.options || []).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
            </select>
          ) : (
            <input key={f.key} type={f.type === 'date' ? 'date' : 'text'} placeholder={f.ph}
              value={d[f.key] || ''}
              onChange={(e) => setD({ ...d, [f.key]: f.digits ? e.target.value.replace(/[^\d.]/g, '') : e.target.value })}
              style={css(INP + `;${f.width ? 'width:' + f.width : 'flex:1;min-width:120px'}`)} />
          ),
        )}
        <button onClick={add} style={css('height:36px;padding:0 16px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer')}>{L('+ افزودن', '+ Add')}</button>
      </div>
      {rows.length ? (
        <div style={css('display:flex;flex-direction:column;gap:4px')}>
          {rows.map((row) => (
            <div key={row.id} style={css('display:flex;align-items:center;gap:12px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:8px 11px')}>
              {fields.map((f, i) => (
                <span key={f.key} style={css(`font-size:12.5px;${i === 0 ? 'font-weight:700' : 'color:var(--mut)'};${i === 0 ? 'min-width:120px' : ''}`)}>
                  {f.type === 'select' ? ((f.options || []).find(([val]) => val === row[f.key])?.[1] || row[f.key] || '') : (row[f.key] || (i === 0 ? '—' : ''))}
                </span>
              ))}
              <div style={css('flex:1')}></div>
              <Box onClick={() => update(rows.filter((x) => x.id !== row.id))} css="width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer" hover="background:var(--dngd);color:var(--dng)" title={L('حذف', 'Delete')}>✕</Box>
            </div>
          ))}
        </div>
      ) : (
        <div style={css('font-size:12px;color:var(--mut);text-align:center;padding:10px')}>{L('هنوز چیزی وارد نشده.', 'Nothing entered yet.')}</div>
      )}
    </div>
  )
}
