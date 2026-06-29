import { useState } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useCollection } from '../lib/useCollection'

type Staff = { id: string; name: string; role: string }

// Real — the language toggle changes the app language; the staff list is a
// persistent collection. No fake user table / dummy team-season dropdowns.
export function Settings({ v }: PageProps) {
  const t = v.t
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const { rows, update } = useCollection<Staff>('staff', [])
  const [d, setD] = useState({ name: '', role: 'analyst' })
  const INP = 'height:36px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 10px;outline:none'
  const roleLabel: Record<string, string> = {
    senior: L('آنالیزور ارشد', 'Senior analyst'), analyst: L('آنالیزور', 'Analyst'),
    coach: L('مربی', 'Coach'), player: L('بازیکن', 'Player'),
  }

  function add() {
    if (!d.name.trim()) return
    update([...rows, { id: `${rows.length}-${d.name}`, name: d.name, role: d.role }])
    setD({ name: '', role: d.role })
  }

  return (
    <div style={css('max-width:1100px;margin:0 auto')}>
      <div style={css('display:grid;grid-template-columns:1.5fr 1fr;gap:14px')}>
        {/* persistent staff list */}
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:14px')}>{L('کادر و نقش‌ها', 'Staff & roles')}</div>
          </div>
          <div style={css('font-size:11px;color:var(--mut);margin-bottom:14px')}>{L('اعضای کادر را وارد کن — ذخیره می‌ماند', 'add staff members — persists')}</div>
          <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px')}>
            <input placeholder={L('نام', 'Name')} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} style={css(INP + ';flex:1;min-width:140px')} />
            <select value={d.role} onChange={(e) => setD({ ...d, role: e.target.value })} style={css(INP + ';cursor:pointer')}>
              <option value="senior">{roleLabel.senior}</option>
              <option value="analyst">{roleLabel.analyst}</option>
              <option value="coach">{roleLabel.coach}</option>
              <option value="player">{roleLabel.player}</option>
            </select>
            <button onClick={add} style={css('height:36px;padding:0 16px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer')}>{L('+ افزودن', '+ Add')}</button>
          </div>
          {rows.length ? (
            <div style={css('display:flex;flex-direction:column;gap:4px')}>
              {rows.map((u) => (
                <div key={u.id} style={css('display:flex;align-items:center;gap:11px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:9px 12px')}>
                  <span style={css('width:30px;height:30px;border-radius:50%;background:var(--raised);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--sub)')}>{(u.name || '?').slice(0, 1)}</span>
                  <span style={css('font-weight:600;font-size:13px;flex:1')}>{u.name}</span>
                  <span style={css('font-size:11px;font-weight:700;color:var(--ac);background:var(--acd);padding:3px 10px;border-radius:20px')}>{roleLabel[u.role] || u.role}</span>
                  <Box onClick={() => update(rows.filter((x) => x.id !== u.id))} css="width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer" hover="background:var(--dngd);color:var(--dng)" title={L('حذف', 'Delete')}>✕</Box>
                </div>
              ))}
            </div>
          ) : (
            <div style={css('font-size:12px;color:var(--mut);text-align:center;padding:10px')}>{L('هنوز کادری وارد نشده.', 'No staff yet.')}</div>
          )}
        </div>

        {/* real general settings */}
        <div style={css('display:flex;flex-direction:column;gap:14px')}>
          <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
            <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{t.general}</div>
            <div style={css('display:flex;align-items:center;justify-content:space-between;padding:11px 0')}>
              <span style={css('font-size:13px;color:var(--sub)')}>{t.language}</span>
              <div style={css('display:flex;gap:4px;background:var(--bg2);border-radius:8px;padding:3px')}>
                <button onClick={v.setFa} style={css(`padding:6px 14px;border:none;border-radius:6px;background:${v.faBtnBg};color:${v.faBtnFg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`)}>فارسی</button>
                <button onClick={v.setEn} style={css(`padding:6px 14px;border:none;border-radius:6px;background:${v.enBtnBg};color:${v.enBtnFg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`)}>English</button>
              </div>
            </div>
          </div>
          <div style={css('background:linear-gradient(160deg,rgba(56,189,248,.07),var(--card) 55%);border:1px solid rgba(56,189,248,.2);border-radius:14px;padding:18px')}>
            <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:8px')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--ai)"><path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" /></svg>
              <span style={css('font-weight:700;font-size:13px;color:var(--ai)')}>{t.aiName}</span>
            </div>
            <div style={css('font-size:12px;color:#cdd2d8;line-height:1.65')}>
              {L('روستر و برنامه‌ی تیم در «دیتابیس لیگ» و «برنامه‌ی بازی‌ها» مدیریت می‌شوند. شخصی‌سازیِ دستیار در صفحه‌ی دستیار هوشمند است.',
                'Team roster & fixtures are managed in “League DB” and “Schedule”. Assistant personalization lives on the AI Assistant page.')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
