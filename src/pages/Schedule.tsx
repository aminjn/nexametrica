import { Fragment, useState } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useCollection } from '../lib/useCollection'

type Fixture = { id: string; date: string; type: 'match' | 'training'; opponent: string; note: string }

// Ported from prototype lines 1578–1647. Top block is REAL — a persistent fixture
// list you fill in yourself (matches & training).
export function Schedule({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
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
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
      </div>
    <div
      style={css(
        'display:grid;grid-template-columns:1fr 420px;gap:16px',
      )}
    >
      <div>
        <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:14px')}>
          {vm.comps.map((c: any, i: number) => (
            <div
              key={i}
              style={css(
                'display:flex;align-items:center;gap:7px;padding:6px 12px;background:var(--card);border:1px solid var(--bd);border-radius:20px',
              )}
            >
              <span style={css(`width:9px;height:9px;border-radius:3px;background:${c.c}`)}></span>
              <span style={css('font-size:12px;font-weight:600')}>{c.name}</span>
              <span style={css('font-size:11px;color:var(--mut)')}>{c.n}</span>
            </div>
          ))}
          <div style={css('flex:1')}></div>
          <button
            onClick={vm.addLeague}
            style={css(
              'height:34px;padding:0 14px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
            )}
          >
            ＋ {t.addLeague}
          </button>
          <button
            onClick={vm.addMatch}
            style={css(
              'height:34px;padding:0 14px;background:var(--ac);border:none;border-radius:9px;color:#0d0f12;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer',
            )}
          >
            ＋ {t.addMatch}
          </button>
        </div>
        <div style={css('display:flex;flex-direction:column;gap:10px')}>
          {vm.fixtures.map((f: any, i: number) => (
            <div
              key={i}
              style={css(
                `background:var(--card);border:1px solid ${f.isNext};border-radius:13px;padding:14px 16px;display:flex;align-items:center;gap:14px`,
              )}
            >
              <div style={css('text-align:center;min-width:80px')}>
                <div style={css('font-size:13px;font-weight:800;font-family:monospace')}>{f.d}</div>
                <div style={css('font-size:10.5px;color:var(--mut);margin-top:2px')}>{f.wd}</div>
              </div>
              <div style={css('width:1px;height:34px;background:var(--bd)')}></div>
              <span
                style={css(
                  `width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#0d0f12;background:${f.haC};flex-shrink:0`,
                )}
              >
                {f.haL}
              </span>
              <div style={css('flex:1;min-width:0')}>
                <div style={css('font-size:14px;font-weight:700;margin-bottom:3px')}>{f.opp}</div>
                <div style={css('display:flex;align-items:center;gap:6px')}>
                  <span style={css(`width:7px;height:7px;border-radius:2px;background:${f.compC}`)}></span>
                  <span style={css('font-size:11px;color:var(--sub)')}>{f.compName}</span>
                </div>
              </div>
              {f.score ? (
                <div
                  style={css('font-size:17px;font-weight:800;font-family:monospace;letter-spacing:1px')}
                >
                  {f.score}
                </div>
              ) : null}
              <span
                style={css(
                  `font-size:11px;font-weight:700;color:${f.stC};background:rgba(255,255,255,.05);padding:4px 11px;border-radius:20px;white-space:nowrap`,
                )}
              >
                {f.stL}
              </span>
              <Box
                as="button"
                onClick={f.edit}
                css="width:30px;height:30px;border-radius:8px;background:transparent;border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--mut)"
                hover="border-color:var(--bd2)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" />
                </svg>
              </Box>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:18px',
          )}
        >
          <div style={css('display:flex;align-items:center;margin-bottom:16px')}>
            <button
              onClick={vm.prevMonth}
              style={css(
                'width:30px;height:30px;border-radius:8px;background:var(--bg2);border:1px solid var(--bd);cursor:pointer;color:var(--sub);display:flex;align-items:center;justify-content:center',
              )}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
            <div style={css('flex:1;text-align:center;font-size:15px;font-weight:800')}>
              {vm.monthName}
            </div>
            <button
              onClick={vm.nextMonth}
              style={css(
                'width:30px;height:30px;border-radius:8px;background:var(--bg2);border:1px solid var(--bd);cursor:pointer;color:var(--sub);display:flex;align-items:center;justify-content:center',
              )}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m15 6-6 6 6 6" />
              </svg>
            </button>
          </div>
          <div
            style={css(
              'display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-bottom:7px',
            )}
          >
            {vm.wdHead.map((w: any, i: number) => (
              <div
                key={i}
                style={css('text-align:center;font-size:10.5px;font-weight:700;color:var(--mut)')}
              >
                {w}
              </div>
            ))}
          </div>
          <div style={css('display:grid;grid-template-columns:repeat(7,1fr);gap:5px')}>
            {vm.cells.map((c: any, i: number) => (
              <Fragment key={i}>
                {c.blank ? <div></div> : null}
                {c.num ? (
                  <div
                    style={css(
                      `aspect-ratio:1;border-radius:8px;background:${c.bg};border:1px solid ${c.bd};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px`,
                    )}
                  >
                    <span style={css('font-size:12px;font-weight:600')}>{c.num}</span>
                    <span
                      style={css(`width:5px;height:5px;border-radius:50%;background:${c.dot}`)}
                    ></span>
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
          <div
            style={css(
              'display:flex;align-items:center;gap:16px;margin-top:16px;padding-top:14px;border-top:1px solid var(--bd)',
            )}
          >
            <div style={css('display:flex;align-items:center;gap:6px')}>
              <span style={css('width:10px;height:10px;border-radius:3px;background:var(--ac)')}></span>
              <span style={css('font-size:11.5px;color:var(--sub)')}>{t.matchDay}</span>
            </div>
            <div style={css('display:flex;align-items:center;gap:6px')}>
              <span style={css('width:10px;height:10px;border-radius:3px;background:var(--ai)')}></span>
              <span style={css('font-size:11.5px;color:var(--sub)')}>{t.trainDay}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
