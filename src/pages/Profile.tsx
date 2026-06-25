import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 571–671. vm = v.vm (engine.vm_profile()).
export function Profile({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <div
        style={css(
          'background:linear-gradient(110deg,rgba(163,230,53,.08),var(--card) 45%);border:1px solid var(--bd);border-radius:16px;padding:22px;display:flex;align-items:center;gap:22px;margin-bottom:14px',
        )}
      >
        <div
          style={css(
            'width:88px;height:88px;border-radius:18px;background:repeating-linear-gradient(135deg,#21262e,#21262e 8px,#1c2027 8px,#1c2027 16px);display:flex;align-items:flex-end;justify-content:center;position:relative;flex-shrink:0;overflow:hidden',
          )}
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="#3a414d">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0z" />
          </svg>
          <span
            style={css(
              'position:absolute;top:6px;inset-inline-start:6px;background:var(--ac);color:#0d0f12;font-size:12px;font-weight:800;width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center',
            )}
          >
            {vm.num}
          </span>
        </div>
        <div style={css('flex:1;position:relative')}>
          {vm.canPick ? (
            <>
              <button
                onClick={vm.toggleProfileMenu}
                style={css(
                  'display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;font-family:inherit;padding:0;margin-bottom:3px',
                )}
              >
                <span style={css('font-size:22px;font-weight:800;color:var(--tx)')}>{vm.name}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div
                style={css(
                  `position:absolute;top:36px;inset-inline-start:0;width:250px;max-height:280px;overflow-y:auto;background:var(--bg2);border:1px solid var(--bd2);border-radius:12px;padding:7px;box-shadow:0 18px 44px rgba(0,0,0,.5);z-index:30;opacity:${vm.pmOpacity};pointer-events:${vm.pmPointer};transform:${vm.pmTransform};transition:opacity .18s,transform .18s`,
                )}
              >
                {vm.playerList.map((pl: any, i: number) => (
                  <Box
                    key={i}
                    as="button"
                    onClick={pl.set}
                    css={`width:100%;display:flex;align-items:center;gap:10px;padding:8px 10px;border:none;border-radius:9px;background:${pl.bg};cursor:pointer;font-family:inherit;text-align:start`}
                    hover="background:var(--card2)"
                  >
                    <span
                      style={css(
                        'width:24px;height:24px;border-radius:6px;background:var(--raised);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:var(--sub);flex-shrink:0',
                      )}
                    >
                      {pl.num}
                    </span>
                    <span style={css('flex:1;font-size:12.5px;font-weight:600;color:var(--tx)')}>{pl.name}</span>
                    <span style={css('font-size:10.5px;color:var(--mut)')}>{pl.pos}</span>
                  </Box>
                ))}
              </div>
            </>
          ) : null}
          {vm.notPick ? (
            <div style={css('font-size:22px;font-weight:800;margin-bottom:3px')}>{vm.name}</div>
          ) : null}
          <div style={css('font-size:13px;color:var(--sub)')}>
            {vm.pos} · {t.age} {vm.age} · {vm.clubLabel}
          </div>
        </div>
        <div style={css('text-align:center;padding:0 20px;border-inline-start:1px solid var(--bd)')}>
          <div style={css('font-size:11px;color:var(--mut);margin-bottom:4px')}>{t.rating}</div>
          <div style={css('font-size:30px;font-weight:800;color:var(--ac)')}>{vm.rate}</div>
        </div>
        <button
          style={css(
            'height:40px;padding:0 18px;background:var(--card2);border:1px solid var(--bd2);border-radius:10px;color:var(--tx);font-family:inherit;font-weight:700;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:8px',
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" />
          </svg>
          {t.compare}
        </button>
      </div>
      <div
        style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px;margin-bottom:14px')}
      >
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:14px')}>
          <div style={css('font-weight:700;font-size:14px')}>{t.playerParams}</div>
          <span
            style={css(
              'display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;color:var(--ai);background:var(--aid);padding:3px 9px;border-radius:20px',
            )}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            {t.mlNote}
          </span>
        </div>
        <div style={css('display:grid;grid-template-columns:repeat(6,1fr);gap:10px')}>
          {vm.bio.map((b: any, i: number) => (
            <div
              key={i}
              style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:12px 13px')}
            >
              <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:6px')}>{b.k}</div>
              <div style={css('font-size:14px;font-weight:700')}>{b.v}</div>
            </div>
          ))}
          <div
            style={css(
              'grid-column:span 6;display:flex;align-items:center;gap:12px;background:var(--warnd);border:1px solid rgba(245,158,11,.25);border-radius:10px;padding:12px 14px;margin-top:2px',
            )}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span style={css('font-size:12.5px;color:var(--sub)')}>{t.contractEnd}:</span>
            <span style={css('font-size:13.5px;font-weight:800;color:var(--warn)')}>{vm.contract.end}</span>
            <span style={css('font-size:11.5px;color:var(--mut)')}>
              ({vm.contract.left} {t.remaining})
            </span>
          </div>
        </div>
      </div>
      <div
        style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px;margin-bottom:14px')}
      >
        <div style={css('display:flex;align-items:center;gap:9px;margin-bottom:13px')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--dng)" strokeWidth="1.8">
            <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z" />
          </svg>
          <div style={css('font-weight:700;font-size:14px')}>{t.injuryHistory}</div>
          <span style={css('font-size:11px;color:var(--mut)')}>
            {vm.injuryCount} {t.records}
          </span>
        </div>
        {vm.injuries ? (
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            {vm.injuries.map((inj: any, i: number) => (
              <div
                key={i}
                style={css(
                  `display:flex;align-items:center;gap:12px;padding:10px 13px;background:var(--bg2);border-radius:10px;border-inline-start:3px solid ${inj.c}`,
                )}
              >
                <div style={css('flex:1;font-size:12.5px;font-weight:600')}>{inj.name}</div>
                <span style={css('font-size:11.5px;color:var(--sub);font-family:monospace')}>{inj.date}</span>
                <span
                  style={css(
                    `font-size:10.5px;font-weight:700;color:${inj.c};background:${inj.bg};padding:3px 10px;border-radius:20px`,
                  )}
                >
                  {inj.days} {t.daysOut}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div style={css('display:grid;grid-template-columns:1fr 1.3fr;gap:14px;margin-bottom:14px')}>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:8px')}>{t.skillRadar}</div>
          {vm.radar}
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:6px')}>{t.seasonForm}</div>
          <div style={css('font-size:11px;color:var(--mut);margin-bottom:10px')}>
            {t.lastN} ۱۰ {t.matches}
          </div>
          {vm.form}
          <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px')}>
            {vm.tiles.map((ti: any, i: number) => (
              <div key={i} style={css('background:var(--bg2);border-radius:10px;padding:11px 13px')}>
                <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:5px')}>{ti.k}</div>
                <div style={css('font-size:18px;font-weight:800')}>{ti.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={css(
          'background:linear-gradient(150deg,rgba(56,189,248,.07),var(--card) 50%);border:1px solid rgba(56,189,248,.2);border-radius:14px;padding:18px 20px;margin-bottom:14px',
        )}
      >
        <div style={css('display:flex;align-items:center;gap:9px;margin-bottom:12px')}>
          <span
            style={css(
              'display:flex;align-items:center;gap:6px;background:var(--aid);color:var(--ai);font-size:11px;font-weight:800;padding:4px 11px;border-radius:20px',
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            {t.aiEval}
          </span>
          <span style={css('margin-inline-start:auto;font-size:11px;font-weight:700;color:var(--sub)')}>
            {t.confidence} <b style={css('color:var(--ai)')}>{vm.evalConf}٪</b>
          </span>
        </div>
        <div style={css('font-size:13px;color:#cdd2d8;line-height:1.8')}>{vm.evalAI.text}</div>
        <button
          onClick={vm.evalAI.onWhy}
          style={css(
            'margin-top:10px;display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--ai);padding:0',
          )}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3M12 17h.01" strokeLinecap="round" />
          </svg>
          {vm.evalAI.whyLabel}
        </button>
        {vm.evalAI.open ? (
          <div
            style={css(
              'margin-top:8px;padding:11px 13px;background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.18);border-radius:9px;font-size:12px;color:#aeb6bf;line-height:1.7',
            )}
          >
            {vm.evalAI.explain}
          </div>
        ) : null}
      </div>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
        <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:14px')}>
          <div style={css('font-weight:700;font-size:14px')}>{t.personalClips}</div>
          <button
            onClick={v.goClips}
            style={css(
              'font-size:12px;color:var(--ac);background:none;border:none;cursor:pointer;font-family:inherit;font-weight:600',
            )}
          >
            {t.viewAll} →
          </button>
        </div>
        <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px')}>
          {vm.tiles.map((ti: any, i: number) => (
            <Box
              key={i}
              css="aspect-ratio:16/10;border-radius:11px;background:repeating-linear-gradient(120deg,#1b1f26,#1b1f26 10px,#191d23 10px,#191d23 20px);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative"
              hover="outline:1px solid var(--bd2)"
            >
              <div
                style={css(
                  'width:38px;height:38px;border-radius:50%;background:rgba(13,15,18,.55);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.15)',
                )}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </Box>
          ))}
        </div>
      </div>
    </div>
  )
}
