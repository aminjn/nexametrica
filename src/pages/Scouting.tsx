import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 673–793. vm = v.vm (engine.vm_scouting()).
export function Scouting({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div
      style={css(
        'max-width:1320px;margin:0 auto;display:grid;grid-template-columns:1fr 320px;gap:16px',
      )}
    >
      <div>
        <div
          style={css(
            'display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap',
          )}
        >
          <div
            style={css(
              'display:flex;gap:5px;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:4px',
            )}
          >
            <button
              onClick={vm.setTeam}
              style={css(
                `display:flex;align-items:center;gap:7px;padding:8px 14px;border:none;border-radius:7px;background:${vm.scopeTeamBg};color:${vm.scopeTeamFg};font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer`,
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
              </svg>
              {t.scopeTeam}
            </button>
            <button
              onClick={vm.setLeague}
              style={css(
                `display:flex;align-items:center;gap:7px;padding:8px 14px;border:none;border-radius:7px;background:${vm.scopeLeagueBg};color:${vm.scopeLeagueFg};font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer`,
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              {t.scopeLeague}
            </button>
          </div>
          <div style={css('flex:1')}></div>
          <span style={css('font-size:12px;color:var(--mut)')}>
            {vm.playerCount} {t.player}
          </span>
        </div>
        <div
          style={css(
            'display:flex;gap:5px;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:4px;margin-bottom:14px;width:fit-content',
          )}
        >
          {vm.scoutViews.map((v: any, i: number) => (
            <button
              key={i}
              onClick={v.set}
              style={css(
                `padding:7px 15px;border:none;border-radius:7px;background:${v.bg};color:${v.fg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`,
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
        {vm.vw_list ? (
          <>
            {vm.league ? (
              <div
                style={css(
                  'display:flex;align-items:center;gap:11px;background:linear-gradient(150deg,rgba(56,189,248,.08),var(--card) 60%);border:1px solid rgba(56,189,248,.22);border-radius:12px;padding:13px 16px;margin-bottom:14px',
                )}
              >
                <span
                  style={css(
                    'width:30px;height:30px;border-radius:9px;background:var(--aid);display:flex;align-items:center;justify-content:center;flex-shrink:0',
                  )}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--ai)">
                    <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                  </svg>
                </span>
                <div style={css('flex:1;font-size:12.5px;color:#cdd2d8;line-height:1.6')}>
                  <b style={css('color:var(--ai)')}>۱٬۸۴۰</b> {t.fromFilms} ·{' '}
                  <b style={css('color:var(--tx)')}>۱٬۲۴۸</b> {t.filmsAnalyzed}
                </div>
              </div>
            ) : null}
            <div
              style={css(
                'display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap',
              )}
            >
              {vm.posFilters.map((pf: any, i: number) => (
                <button
                  key={i}
                  onClick={pf.set}
                  style={css(
                    `height:34px;padding:0 14px;background:${pf.bg};border:1px solid ${pf.bd};border-radius:9px;color:${pf.fg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`,
                  )}
                >
                  {pf.label}
                </button>
              ))}
              <button
                style={css(
                  'height:34px;padding:0 13px;background:var(--card);border:1px solid var(--bd);border-radius:9px;color:var(--sub);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
                )}
              >
                {t.age} ▾
              </button>
              <div style={css('flex:1')}></div>
              <button
                onClick={vm.excelExport}
                style={css(
                  'height:34px;padding:0 14px;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.3);border-radius:9px;color:var(--good);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:7px',
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13l6 6M15 13l-6 6" />
                </svg>
                {t.excelExport}
              </button>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;overflow:hidden',
              )}
            >
              <div
                style={css(
                  'display:flex;align-items:center;font-size:11px;color:var(--mut);font-weight:700;padding:12px 16px;border-bottom:1px solid var(--bd);background:var(--bg2)',
                )}
              >
                <span style={css('width:30px')}></span>
                <span style={css('flex:1')}>{t.name}</span>
                <span style={css('width:96px')}>{t.club}</span>
                <span style={css('width:74px')}>{t.position}</span>
                <span style={css('width:40px;text-align:center')}>{t.age}</span>
                <span style={css('width:46px;text-align:center')}>{t.rating}</span>
                <span style={css('width:34px;text-align:center')}>{t.goals}</span>
                <span style={css('width:34px;text-align:center')}>{t.assists}</span>
              </div>
              {vm.rows.map((r: any, i: number) => (
                <Box
                  key={i}
                  css="display:flex;align-items:center;font-size:12.5px;padding:11px 16px;border-bottom:1px solid var(--bd);cursor:pointer"
                  hover="background:var(--bg2)"
                >
                  <span style={css('width:30px')}>
                    <span
                      style={css(
                        'width:26px;height:26px;border-radius:7px;background:var(--raised);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--sub)',
                      )}
                    >
                      {r.tag}
                    </span>
                  </span>
                  <span
                    style={css(
                      'flex:1;font-weight:600;display:flex;align-items:center;gap:7px',
                    )}
                  >
                    {r.n}
                    {r.fromFilm ? (
                      <span
                        title={t.fromFilm}
                        style={css(
                          'display:inline-flex;align-items:center;gap:3px;font-size:9px;font-weight:700;color:var(--ai);background:var(--aid);padding:1px 6px;border-radius:20px',
                        )}
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                        </svg>
                        {t.fromFilm}
                      </span>
                    ) : null}
                  </span>
                  <span
                    style={css(
                      'width:96px;color:var(--sub);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                    )}
                  >
                    {r.club}
                  </span>
                  <span style={css('width:74px;color:var(--sub);font-size:11.5px')}>{r.pos}</span>
                  <span style={css('width:40px;text-align:center;font-family:monospace')}>{r.age}</span>
                  <span
                    style={css(
                      `width:46px;text-align:center;font-family:monospace;font-weight:700;color:${r.rateC}`,
                    )}
                  >
                    {r.rate}
                  </span>
                  <span style={css('width:34px;text-align:center;font-family:monospace')}>{r.g}</span>
                  <span style={css('width:34px;text-align:center;font-family:monospace')}>{r.a}</span>
                </Box>
              ))}
            </div>
          </>
        ) : null}
        {vm.vw_rankings ? (
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
              )}
            >
              <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:14px')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.9">
                  <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 4H4v2a3 3 0 0 0 3 3M17 4h3v2a3 3 0 0 1-3 3" />
                </svg>
                <div style={css('font-weight:700;font-size:14px')}>{t.rankings}</div>
                <span style={css('margin-inline-start:auto;font-size:10px;color:var(--mut)')}>
                  {t.byRating}
                </span>
              </div>
              <div style={css('display:flex;flex-direction:column;gap:10px')}>
                {vm.leaderboard.map((l: any, i: number) => (
                  <div key={i} style={css('display:flex;align-items:center;gap:11px')}>
                    <span
                      style={css(
                        `width:20px;font-size:12px;font-weight:800;color:${l.c};text-align:center`,
                      )}
                    >
                      {l.rank}
                    </span>
                    <div style={css('flex:1;min-width:0')}>
                      <div style={css('display:flex;justify-content:space-between;margin-bottom:4px')}>
                        <span
                          style={css(
                            'font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                          )}
                        >
                          {l.n} <span style={css('color:var(--mut);font-weight:400')}>· {l.club}</span>
                        </span>
                        <span
                          style={css(`font-family:monospace;font-size:12px;font-weight:700;color:${l.c}`)}
                        >
                          {l.rate}
                        </span>
                      </div>
                      <div
                        style={css(
                          'height:6px;background:var(--raised);border-radius:6px;overflow:hidden',
                        )}
                      >
                        <div
                          style={css(`height:100%;width:${l.pct};background:${l.c};border-radius:6px`)}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
              )}
            >
              <div
                style={css(
                  'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px',
                )}
              >
                <div style={css('font-weight:700;font-size:14px')}>{t.scatterTitle}</div>
                <span
                  style={css(
                    'display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:var(--ai);background:var(--aid);padding:2px 8px;border-radius:20px',
                  )}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                  </svg>
                  AI
                </span>
              </div>
              <div style={css('font-size:11px;color:var(--mut);margin-bottom:10px')}>{t.scatterSub}</div>
              {vm.scatterEl}
            </div>
          </div>
        ) : null}
        {vm.vw_shadow ? (
          <div
            style={css(
              'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
            )}
          >
            <div style={css('display:flex;align-items:center;gap:9px;margin-bottom:6px')}>
              <div style={css('font-weight:700;font-size:15px')}>{t.shadowTeam}</div>
              <span
                style={css(
                  'display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;color:var(--ai);background:var(--aid);padding:3px 9px;border-radius:20px',
                )}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                </svg>
                {t.aiPicked}
              </span>
              <span style={css('margin-inline-start:auto;font-size:11px;color:var(--mut)')}>
                ۴-۳-۳ · {t.fromFilms}
              </span>
            </div>
            <div style={css('font-size:12px;color:var(--sub);line-height:1.6;margin-bottom:12px')}>
              {t.shadowDesc}
            </div>
            {vm.shadowEl}
          </div>
        ) : null}
      </div>
      <div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:14px',
          )}
        >
          <div style={css('font-weight:700;font-size:14px;margin-bottom:6px')}>{t.compare}</div>
          <div style={css('display:flex;gap:14px;margin-bottom:8px;font-size:11.5px')}>
            <span style={css('display:flex;align-items:center;gap:5px')}>
              <span style={css('width:9px;height:9px;border-radius:2px;background:var(--ac)')}></span>امیر حسینی
            </span>
            <span style={css('display:flex;align-items:center;gap:5px')}>
              <span style={css('width:9px;height:9px;border-radius:2px;background:var(--ai)')}></span>کاوه احمدی
            </span>
          </div>
          {vm.cmp}
          <div
            style={css(
              'margin-top:14px;padding:14px;background:linear-gradient(150deg,rgba(56,189,248,.07),transparent);border:1px solid rgba(56,189,248,.2);border-radius:11px',
            )}
          >
            <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:7px')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--ai)">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              <span style={css('font-size:12px;font-weight:700;color:var(--ai)')}>{t.scoutReport}</span>
            </div>
            <div style={css('font-size:12px;color:#cdd2d8;line-height:1.65')}>
              امیر حسینی در دریبل و سرعت برتر است؛ کاوه احمدی در شوت و قدرت بدنی. برای فاز حمله از جناح، حسینی گزینه بهتری است.
            </div>
          </div>
        </div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
          )}
        >
          <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:4px')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ai)">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            <div style={css('font-weight:700;font-size:14px')}>{t.similarPlayer}</div>
          </div>
          <div style={css('font-size:11px;color:var(--mut);margin-bottom:14px')}>
            مشابه امیر حسینی — از روی فیلم‌های لیگ
          </div>
          <div style={css('display:flex;flex-direction:column;gap:9px')}>
            {vm.similar.map((s: any, i: number) => (
              <Box
                key={i}
                css="display:flex;align-items:center;gap:11px;padding:10px 12px;background:var(--bg2);border-radius:10px;cursor:pointer"
                hover="outline:1px solid var(--bd2)"
              >
                <span
                  style={css(
                    'width:30px;height:30px;border-radius:50%;background:var(--raised);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--sub);flex-shrink:0',
                  )}
                >
                  {s.n}
                </span>
                <div style={css('flex:1;min-width:0')}>
                  <div style={css('font-size:12.5px;font-weight:600')}>{s.n}</div>
                  <div style={css('font-size:11px;color:var(--mut)')}>{s.club}</div>
                </div>
                <div style={css('text-align:center')}>
                  <div style={css('font-size:14px;font-weight:800;color:var(--ac)')}>{s.matchF}٪</div>
                  <div style={css('font-size:9px;color:var(--mut)')}>{t.matchPct}</div>
                </div>
              </Box>
            ))}
          </div>
        </div>
        <div
          style={css(
            'background:linear-gradient(160deg,rgba(56,189,248,.06),var(--card) 55%);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-top:14px',
          )}
        >
          <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:3px')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx)" strokeWidth="1.8">
              <path d="M20 7h-9M14 17H5M17 3l-3 4 3 4M7 21l3-4-3-4" />
            </svg>
            <div style={css('font-weight:700;font-size:14px')}>{t.portfolio}</div>
          </div>
          <div style={css('font-size:11px;color:var(--mut);margin-bottom:14px')}>{vm.pName}</div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:8px')}>
            {vm.pbio.map((b: any, i: number) => (
              <div
                key={i}
                style={css(
                  'display:flex;align-items:center;justify-content:space-between;padding:9px 11px;background:var(--bg2);border-radius:9px',
                )}
              >
                <span style={css('font-size:11.5px;color:var(--sub)')}>{b.k}</span>
                <span style={css('font-size:12.5px;font-weight:700')}>{b.v}</span>
              </div>
            ))}
          </div>
          <div
            style={css(
              'display:flex;align-items:flex-start;gap:8px;margin-top:12px;padding:11px 12px;background:var(--aid);border:1px solid rgba(56,189,248,.22);border-radius:9px',
            )}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="var(--ai)"
              style={css('flex-shrink:0;margin-top:2px')}
            >
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            <div style={css('font-size:11.5px;color:#aeb6bf;line-height:1.6')}>
              {t.mlNote} · {t.retainedForAll}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
