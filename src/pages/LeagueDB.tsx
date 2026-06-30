import { useState } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useCollection } from '../lib/useCollection'
import type { RosterPlayer } from '../lib/useRoster'
import { aiRoster } from '../api'

// Real — your team roster (numbers + names + body profile) which the analysis
// uses to label detected shirt numbers. The AI block fetches a club/league squad
// from the configured LLM and adds them. No mock.
export function LeagueDB({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const { rows, update } = useCollection<RosterPlayer>('roster', [])
  const empty = { number: '', name: '', position: '', height: '', weight: '', thigh: '', calf: '', chest: '', arm: '' }
  const [d, setD] = useState<Record<string, string>>(empty)
  const INP = 'height:36px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 10px;outline:none'
  const num = (ev: any) => ev.target.value.replace(/[^\d.]/g, '')

  // AI squad fetch
  const [aiQ, setAiQ] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [aiMsg, setAiMsg] = useState('')
  async function aiFetch() {
    const q = aiQ.trim()
    if (!q || aiBusy) return
    setAiBusy(true); setAiMsg(L('در حال پرسش از هوشِ مصنوعی…', 'Asking the AI…'))
    try {
      const players = await aiRoster(q, v.lang)
      if (!players.length) { setAiMsg(L('چیزی پیدا نشد — نامِ دیگری امتحان کن.', 'Nothing found — try another name.')); return }
      const have = new Set(rows.map((r) => `${r.number}|${r.name}`))
      const add = players
        .filter((p) => !have.has(`${p.number}|${p.name}`))
        .map((p, i) => ({ id: `${p.number || 'x'}-${rows.length + i}`, number: p.number, name: p.name, position: p.position, height: '', weight: '', thigh: '', calf: '', chest: '', arm: '' } as RosterPlayer))
      update([...rows, ...add])
      setAiMsg(L(`${add.length} بازیکن اضافه شد. قد/وزن را دستی کامل کن.`, `Added ${add.length} players. Fill height/weight manually.`))
      setAiQ('')
    } catch {
      setAiMsg(L('ناموفق — سرویسِ AI تنظیم نشده؟ (پنلِ مدیریت → ارائه‌دهنده‌ها).', 'Failed — AI provider not configured? (Super admin → providers).'))
    } finally {
      setAiBusy(false)
    }
  }

  function bmi(p: { height?: string; weight?: string }) {
    const h = Number(p.height), w = Number(p.weight)
    if (!h || !w) return null
    return Math.round((w / (h / 100) ** 2) * 10) / 10
  }
  function bmiColor(b: number) {
    return b < 18.5 ? 'var(--ai)' : b < 25 ? 'var(--good)' : b < 30 ? 'var(--warn)' : 'var(--dng)'
  }

  function add() {
    if (!d.number || !d.name) return
    update([...rows, { id: `${d.number}-${rows.length}`, ...d } as RosterPlayer])
    setD(empty)
  }
  const sorted = [...rows].sort((a, b) => Number(a.number) - Number(b.number))

  return (
    <div style={css('max-width:1340px;margin:0 auto')}>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap')}>
          <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
          <div style={css('font-weight:800;font-size:15px')}>{L('تیمِ من — روستر', 'My team — roster')}</div>
        </div>
        <div style={css('font-size:11px;color:var(--mut);margin-bottom:14px;line-height:1.7')}>
          {L('شماره و نامِ بازیکن‌ها را وارد کن؛ در آنالیز، شماره‌ی پیراهنِ خوانده‌شده به نامِ واقعی وصل می‌شود.',
            'Enter numbers & names; in analysis, detected shirt numbers are matched to real names.')}
        </div>

        {/* AI squad fetch — via the configured LLM (e.g. GapGPT) */}
        <div style={css('background:linear-gradient(150deg,rgba(56,189,248,.08),var(--bg2) 60%);border:1px solid rgba(56,189,248,.22);border-radius:11px;padding:13px 14px;margin-bottom:14px')}>
          <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:9px')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ai)"><path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" /></svg>
            <span style={css('font-size:12.5px;font-weight:800;color:var(--ai)')}>{L('افزودنِ خودکارِ بازیکنان با هوشِ مصنوعی', 'AI: add squad automatically')}</span>
          </div>
          <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:10px;line-height:1.6')}>
            {L('نامِ باشگاه یا تیمِ ملی را بنویس تا هوشِ مصنوعی بازیکنان را اضافه کند (شماره/نام/پست). بعد قد و وزن را دستی کامل کن.',
              'Type a club or national team and the AI adds the players (number/name/position). Then fill height/weight manually.')}
          </div>
          <div style={css('display:flex;gap:8px;flex-wrap:wrap')}>
            <input
              placeholder={L('مثلاً: پرسپولیس / استقلال / تیمِ ملی ایران', 'e.g. Persepolis / Esteghlal / Iran NT')}
              value={aiQ}
              onChange={(ev) => setAiQ(ev.target.value)}
              onKeyDown={(ev) => { if (ev.key === 'Enter') aiFetch() }}
              style={css(INP + ';flex:1;min-width:200px')}
            />
            <button onClick={aiFetch} disabled={aiBusy} style={css(`height:36px;padding:0 16px;background:${aiBusy ? 'var(--card2)' : 'var(--ai)'};border:none;border-radius:8px;color:${aiBusy ? 'var(--mut)' : '#06141f'};font-family:inherit;font-weight:800;font-size:12.5px;cursor:${aiBusy ? 'default' : 'pointer'};display:flex;align-items:center;gap:7px`)}>
              {aiBusy ? (
                <span style={css('width:13px;height:13px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;display:inline-block;animation:nx-spin .7s linear infinite')}></span>
              ) : null}
              {L('دریافت با AI', 'Fetch with AI')}
            </button>
          </div>
          {aiMsg ? <div style={css('font-size:11px;color:var(--sub);margin-top:9px')}>{aiMsg}</div> : null}
        </div>

        <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px')}>
          <input placeholder={L('شماره', 'No.')} value={d.number} onChange={(ev) => setD({ ...d, number: ev.target.value.replace(/\D/g, '') })} style={css(INP + ';width:74px')} />
          <input placeholder={L('نامِ بازیکن', 'Player name')} value={d.name} onChange={(ev) => setD({ ...d, name: ev.target.value })} style={css(INP + ';flex:1;min-width:150px')} />
          <input placeholder={L('پست', 'Position')} value={d.position} onChange={(ev) => setD({ ...d, position: ev.target.value })} style={css(INP + ';width:130px')} />
          <input placeholder={L('قد (cm)', 'Height (cm)')} value={d.height} onChange={(ev) => setD({ ...d, height: num(ev) })} style={css(INP + ';width:100px')} />
          <input placeholder={L('وزن (kg)', 'Weight (kg)')} value={d.weight} onChange={(ev) => setD({ ...d, weight: num(ev) })} style={css(INP + ';width:100px')} />
        </div>
        <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center')}>
          <span style={css('font-size:10.5px;color:var(--mut)')}>{L('اندازه‌ها (cm):', 'Measurements (cm):')}</span>
          <input placeholder={L('دور ران', 'Thigh')} value={d.thigh} onChange={(ev) => setD({ ...d, thigh: num(ev) })} style={css(INP + ';width:96px')} />
          <input placeholder={L('دور ساق', 'Calf')} value={d.calf} onChange={(ev) => setD({ ...d, calf: num(ev) })} style={css(INP + ';width:96px')} />
          <input placeholder={L('دور سینه', 'Chest')} value={d.chest} onChange={(ev) => setD({ ...d, chest: num(ev) })} style={css(INP + ';width:96px')} />
          <input placeholder={L('دور بازو', 'Arm')} value={d.arm} onChange={(ev) => setD({ ...d, arm: num(ev) })} style={css(INP + ';width:96px')} />
          <div style={css('flex:1')}></div>
          <button onClick={add} style={css('height:36px;padding:0 18px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer')}>{L('+ افزودن بازیکن', '+ Add player')}</button>
        </div>
        {sorted.length ? (
          <div style={css('display:flex;flex-direction:column;gap:5px')}>
            {sorted.map((p) => {
              const b = bmi(p)
              const meas = [[L('ران', 'thigh'), p.thigh], [L('ساق', 'calf'), p.calf], [L('سینه', 'chest'), p.chest], [L('بازو', 'arm'), p.arm]].filter(([, x]) => x)
              return (
                <div key={p.id} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:8px 11px;flex-wrap:wrap')}>
                  <span style={css('min-width:24px;height:24px;border-radius:6px;background:var(--ac);color:#0d0f12;font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:12px')}>{p.number}</span>
                  <span style={css('font-size:12.5px;font-weight:700;min-width:110px')}>{p.name}</span>
                  <span style={css('font-size:11px;color:var(--mut);min-width:60px')}>{p.position}</span>
                  {p.height ? <span style={css('font-size:11px;color:var(--sub)')}>{p.height}cm</span> : null}
                  {p.weight ? <span style={css('font-size:11px;color:var(--sub)')}>{p.weight}kg</span> : null}
                  {b ? <span style={css(`font-size:10.5px;font-weight:800;padding:3px 8px;border-radius:20px;color:#0d0f12;background:${bmiColor(b)}`)}>BMI {b}</span> : null}
                  <div style={css('flex:1')}></div>
                  {meas.length ? <span style={css('font-size:10.5px;color:var(--mut);font-family:monospace')}>{meas.map(([k, x]) => `${k} ${x}`).join(' · ')}</span> : null}
                  <Box onClick={() => update(rows.filter((x) => x.id !== p.id))} css="width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer" hover="background:var(--dngd);color:var(--dng)" title={L('حذف', 'Delete')}>✕</Box>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={css('font-size:12px;color:var(--mut);text-align:center;padding:10px')}>{L('هنوز بازیکنی وارد نشده.', 'No players yet.')}</div>
        )}
      </div>
    </div>
  )
}
