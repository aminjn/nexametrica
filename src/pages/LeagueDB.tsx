import { Fragment, useState } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useCollection } from '../lib/useCollection'
import type { RosterPlayer } from '../lib/useRoster'

// Ported from prototype lines 1467–1576. Top block is REAL — your team roster
// (numbers + names) which the analysis uses to label detected shirt numbers.
export function LeagueDB({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const { rows, update } = useCollection<RosterPlayer>('roster', [])
  const [d, setD] = useState({ number: '', name: '', position: '' })
  const INP = 'height:36px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 10px;outline:none'

  function add() {
    if (!d.number || !d.name) return
    update([...rows, { id: `${d.number}-${rows.length}`, number: d.number, name: d.name, position: d.position }])
    setD({ number: '', name: '', position: '' })
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
        <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px')}>
          <input placeholder={L('شماره', 'No.')} value={d.number} onChange={(ev) => setD({ ...d, number: ev.target.value.replace(/\D/g, '') })} style={css(INP + ';width:74px')} />
          <input placeholder={L('نامِ بازیکن', 'Player name')} value={d.name} onChange={(ev) => setD({ ...d, name: ev.target.value })} style={css(INP + ';flex:1;min-width:150px')} />
          <input placeholder={L('پست (اختیاری)', 'Position (optional)')} value={d.position} onChange={(ev) => setD({ ...d, position: ev.target.value })} style={css(INP + ';width:160px')} />
          <button onClick={add} style={css('height:36px;padding:0 16px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer')}>{L('+ افزودن', '+ Add')}</button>
        </div>
        {sorted.length ? (
          <div style={css('display:grid;grid-template-columns:repeat(2,1fr);gap:5px')}>
            {sorted.map((p) => (
              <div key={p.id} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:7px 11px')}>
                <span style={css('min-width:24px;height:24px;border-radius:6px;background:var(--ac);color:#0d0f12;font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:12px')}>{p.number}</span>
                <span style={css('font-size:12.5px;font-weight:700;flex:1')}>{p.name}</span>
                <span style={css('font-size:11px;color:var(--mut)')}>{p.position}</span>
                <Box onClick={() => update(rows.filter((x) => x.id !== p.id))} css="width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer" hover="background:var(--dngd);color:var(--dng)" title={L('حذف', 'Delete')}>✕</Box>
              </div>
            ))}
          </div>
        ) : (
          <div style={css('font-size:12px;color:var(--mut);text-align:center;padding:10px')}>{L('هنوز بازیکنی وارد نشده.', 'No players yet.')}</div>
        )}
      </div>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
      </div>
      {vm.ldb_manage ? (
        <div style={css('max-width:800px')}>
          <div
            style={css(
              'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px;margin-bottom:16px',
            )}
          >
            <div style={css('display:flex;align-items:center;gap:9px;margin-bottom:6px')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ai)">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              <div style={css('font-size:15px;font-weight:800')}>{t.addLeagueTitle}</div>
            </div>
            <div
              style={css('font-size:12.5px;color:var(--sub);line-height:1.7;margin-bottom:15px')}
            >
              {t.addLeagueDesc}
            </div>
            <div style={css('display:flex;gap:10px')}>
              <Box
                as="input"
                value={vm.leagueInput}
                onInput={vm.onLeagueInput}
                onChange={vm.onLeagueInput}
                placeholder={t.leagueNamePh}
                css="flex:1;height:44px;background:var(--bg2);border:1px solid var(--bd);border-radius:11px;color:var(--tx);font-family:inherit;font-size:13.5px;padding:0 15px;outline:none"
                focus="border-color:var(--ai)"
              />
              <button
                onClick={vm.addLeagueByName}
                style={css(
                  'height:44px;padding:0 20px;background:var(--ai);border:none;border-radius:11px;color:#04141f;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:7px;white-space:nowrap',
                )}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {t.fetchLeague}
              </button>
            </div>
            {vm.isFetching ? (
              <div
                style={css(
                  'display:flex;align-items:center;gap:10px;margin-top:14px;padding:11px 14px;background:var(--aid);border:1px solid rgba(56,189,248,.2);border-radius:10px',
                )}
              >
                <span
                  style={css(
                    'width:14px;height:14px;border:2px solid var(--ai);border-top-color:transparent;border-radius:50%;display:inline-block;animation:nx-spin 0.7s linear infinite',
                  )}
                ></span>
                <span style={css('font-size:12.5px;color:var(--ai);font-weight:600')}>
                  {t.fetchingMsg} «{vm.fetchingLeague}» …
                </span>
              </div>
            ) : null}
          </div>
          <div
            style={css(
              'font-size:11px;font-weight:700;color:var(--mut);letter-spacing:.5px;margin:0 4px 10px',
            )}
          >
            {t.activeLeagues}
          </div>
          <div style={css('display:flex;flex-direction:column;gap:10px')}>
            {vm.manageLeagues.map((L: any, i: number) => (
              <div
                key={i}
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:13px;padding:15px 17px;display:flex;align-items:center;gap:15px',
                )}
              >
                <span
                  style={css(
                    'width:40px;height:40px;border-radius:11px;background:var(--raised);display:flex;align-items:center;justify-content:center;flex-shrink:0',
                  )}
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.7">
                    <path d="M6 9H4a2 2 0 0 0 0 4h2M18 9h2a2 2 0 0 1 0 4h-2M6 5h12v6a6 6 0 0 1-12 0zM10 19h4M9 22h6" />
                  </svg>
                </span>
                <div style={css('flex:1;min-width:0')}>
                  <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:3px')}>
                    <span style={css('font-size:14px;font-weight:700')}>{L.name}</span>
                    {L.own ? (
                      <span
                        style={css(
                          'font-size:9px;font-weight:700;color:var(--ac);background:var(--acd);padding:1px 7px;border-radius:20px',
                        )}
                      >
                        {t.ownLeague}
                      </span>
                    ) : null}
                    {L.custom ? (
                      <span
                        style={css(
                          'font-size:9px;font-weight:700;color:var(--ai);background:var(--aid);padding:1px 7px;border-radius:20px',
                        )}
                      >
                        AI
                      </span>
                    ) : null}
                  </div>
                  <div
                    style={css(
                      'font-size:11.5px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                    )}
                  >
                    {L.teamList}
                  </div>
                </div>
                <div style={css('text-align:center;flex-shrink:0')}>
                  <div style={css('font-size:15px;font-weight:800;font-family:monospace')}>
                    {L.teamsN}
                  </div>
                  <div style={css('font-size:10px;color:var(--mut)')}>{t.teams}</div>
                </div>
                <div style={css('text-align:center;flex-shrink:0')}>
                  <div style={css('font-size:15px;font-weight:800;font-family:monospace')}>
                    {L.playersN}
                  </div>
                  <div style={css('font-size:10px;color:var(--mut)')}>{t.player}</div>
                </div>
                <Box
                  as="button"
                  onClick={L.remove}
                  css="width:32px;height:32px;border-radius:9px;background:transparent;border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--dng);flex-shrink:0"
                  hover="border-color:var(--dng)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </Box>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {vm.ldb_table ? (
        <div style={css('display:flex;gap:16px;align-items:flex-start')}>
          {vm.ldb_league ? (
            <div
              style={css(
                'width:214px;flex-shrink:0;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:12px;position:sticky;top:0',
              )}
            >
              <Box
                as="button"
                onClick={vm.railAll.set}
                css={`width:100%;display:flex;align-items:center;gap:9px;padding:9px 11px;border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-size:12.5px;font-weight:700;text-align:start;background:${vm.railAll.bg};color:${vm.railAll.fg}`}
                hover="box-shadow:inset 0 0 0 1px var(--bd2)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                <span style={css('flex:1')}>{t.allPlayers}</span>
              </Box>
              <div
                style={css(
                  'font-size:10px;font-weight:700;color:var(--mut);letter-spacing:.5px;padding:14px 8px 7px',
                )}
              >
                {t.leagues}
              </div>
              {vm.railLeagues.map((lg: any, i: number) => (
                <Fragment key={i}>
                  <Box
                    as="button"
                    onClick={lg.set}
                    css={`width:100%;display:flex;align-items:center;gap:8px;padding:8px 11px;border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;text-align:start;background:${lg.bg};color:${lg.fg}`}
                    hover="box-shadow:inset 0 0 0 1px var(--bd2)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 9H4a2 2 0 0 0 0 4h2M18 9h2a2 2 0 0 1 0 4h-2M6 5h12v6a6 6 0 0 1-12 0zM10 19h4M9 22h6" />
                    </svg>
                    <span
                      style={css(
                        'flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                      )}
                    >
                      {lg.name}
                    </span>
                  </Box>
                  <div
                    style={css(
                      'display:flex;flex-direction:column;gap:1px;margin:2px 0 6px;padding-inline-start:10px;border-inline-start:1px solid var(--bd)',
                    )}
                  >
                    {lg.teams.map((tm: any, j: number) => (
                      <Box
                        key={j}
                        as="button"
                        onClick={tm.set}
                        css={`width:100%;display:flex;align-items:center;gap:8px;padding:6px 10px;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-size:11.5px;font-weight:600;text-align:start;background:${tm.bg};color:${tm.fg}`}
                        hover="background:var(--bg2)"
                      >
                        <span
                          style={css(
                            'width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;opacity:.6',
                          )}
                        ></span>
                        <span
                          style={css(
                            'flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                          )}
                        >
                          {tm.name}
                        </span>
                      </Box>
                    ))}
                  </div>
                </Fragment>
              ))}
            </div>
          ) : null}
          <div style={css('flex:1;min-width:0')}>
            <div
              style={css(
                'display:flex;align-items:center;gap:11px;margin-bottom:13px;flex-wrap:wrap',
              )}
            >
              <div
                style={css(
                  'display:flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--bd);border-radius:11px;padding:8px 13px',
                )}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
                <span style={css('font-size:13px;font-weight:700')}>{vm.count}</span>
                <span style={css('font-size:11.5px;color:var(--mut)')}>
                  {t.player} · {vm.teamCount} {t.teams}
                </span>
              </div>
              <div style={css('position:relative;flex:1;min-width:180px;max-width:320px')}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--mut)"
                  strokeWidth="2"
                  style={css(
                    'position:absolute;inset-inline-start:11px;top:50%;transform:translateY(-50%)',
                  )}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" strokeLinecap="round" />
                </svg>
                <Box
                  as="input"
                  value={vm.search}
                  onInput={vm.onSearch}
                  onChange={vm.onSearch}
                  placeholder={t.search}
                  css="width:100%;height:40px;background:var(--card);border:1px solid var(--bd);border-radius:10px;color:var(--tx);font-family:inherit;font-size:13px;padding-inline-start:36px;padding-inline-end:12px;outline:none"
                  focus="border-color:var(--ac)"
                />
              </div>
              <div style={css('flex:1')}></div>
              <button
                style={css(
                  'height:40px;padding:0 15px;background:var(--card2);border:1px solid var(--bd2);border-radius:10px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer',
                )}
              >
                {t.addPlayer}
              </button>
              <button
                style={css(
                  'height:40px;padding:0 14px;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.3);border-radius:10px;color:var(--good);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:7px',
                )}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13l6 6M15 13l-6 6" />
                </svg>
                Excel
              </button>
            </div>
            <div
              style={css(
                'display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap',
              )}
            >
              <span
                style={css('font-size:11px;color:var(--mut);font-weight:700;margin-inline-end:2px')}
              >
                {t.position}:
              </span>
              {vm.posFilters.map((pf: any, i: number) => (
                <button
                  key={i}
                  onClick={pf.set}
                  style={css(
                    `height:32px;padding:0 13px;background:${pf.bg};border:1px solid var(--bd);border-radius:8px;color:${pf.fg};font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer`,
                  )}
                >
                  {pf.label}
                </button>
              ))}
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;overflow:hidden;--gc:34px minmax(120px,1.4fr) 112px 96px 48px 48px 48px 60px 80px 58px 88px 66px',
              )}
            >
              <div
                style={css(
                  'display:grid;grid-template-columns:var(--gc);align-items:center;padding:0 14px;background:var(--bg2);border-bottom:1px solid var(--bd)',
                )}
              >
                <span></span>
                {vm.columns.map((c: any, i: number) => (
                  <Box
                    key={i}
                    as="button"
                    onClick={c.set}
                    css={`display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:${c.fg};padding:13px 0;text-align:start`}
                    hover="color:var(--tx)"
                  >
                    {c.label}
                    <span style={css('font-size:9px')}>{c.arrow}</span>
                  </Box>
                ))}
                <span
                  style={css('font-size:11px;font-weight:700;color:var(--mut);text-align:start')}
                >
                  {t.actions}
                </span>
              </div>
              <div style={css('max-height:calc(100vh - 280px);overflow-y:auto')}>
                {vm.rows.map((r: any, i: number) => (
                  <Box
                    key={i}
                    css="display:grid;grid-template-columns:var(--gc);align-items:center;padding:9px 14px;border-bottom:1px solid var(--bd)"
                    hover="background:var(--bg2)"
                  >
                    <span
                      style={css(
                        'width:26px;height:26px;border-radius:7px;background:var(--raised);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--sub)',
                      )}
                    >
                      {r.ini}
                    </span>
                    <span
                      style={css(
                        'font-size:12.5px;font-weight:600;display:flex;align-items:center;gap:7px;min-width:0;padding-inline-end:8px',
                      )}
                    >
                      <span
                        style={css('white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}
                      >
                        {r.n}
                      </span>
                      {r.ownTag ? (
                        <span
                          style={css(
                            'font-size:9px;font-weight:700;color:var(--ac);background:var(--acd);padding:1px 6px;border-radius:20px;flex-shrink:0',
                          )}
                        >
                          {r.ownTag}
                        </span>
                      ) : null}
                    </span>
                    <span
                      style={css(
                        'font-size:11.5px;color:var(--sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-inline-end:6px',
                      )}
                    >
                      {r.club}
                    </span>
                    <span style={css('font-size:11.5px;color:var(--sub)')}>{r.pos}</span>
                    <span style={css('font-size:12px;font-family:monospace')}>{r.age}</span>
                    <span style={css('font-size:12px;font-family:monospace;color:var(--sub)')}>
                      {r.ht}
                    </span>
                    <span style={css('font-size:12px;font-family:monospace;color:var(--sub)')}>
                      {r.wt}
                    </span>
                    <span
                      style={css(
                        `font-size:12.5px;font-family:monospace;font-weight:700;color:${r.rateC}`,
                      )}
                    >
                      {r.rate}
                    </span>
                    <span style={css('font-size:12px;font-family:monospace')}>{r.val} €</span>
                    <span
                      style={css(
                        `font-size:11px;font-family:monospace;font-weight:700;color:${r.injC}`,
                      )}
                    >
                      {r.inj}
                    </span>
                    <span style={css('font-size:11.5px;font-family:monospace;color:var(--mut)')}>
                      {r.contract}
                    </span>
                    <Box
                      as="button"
                      onClick={r.view}
                      css="height:28px;padding:0 11px;background:var(--card2);border:1px solid var(--bd2);border-radius:7px;color:var(--ac);font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;width:fit-content"
                      hover="border-color:var(--ac)"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {t.view}
                    </Box>
                  </Box>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
