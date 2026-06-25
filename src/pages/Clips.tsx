import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 795–864. vm = v.vm (engine.vm_clips()).
export function Clips({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div
      style={css('max-width:1320px;margin:0 auto;display:grid;grid-template-columns:260px 1fr;gap:16px')}
    >
      <div>
        <button
          style={css(
            'width:100%;height:40px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer;margin-bottom:14px',
          )}
        >
          + {t.newPlaylist}
        </button>
        <div
          style={css('font-size:11px;color:var(--mut);font-weight:700;margin-bottom:10px;padding:0 4px')}
        >
          {t.playlists}
        </div>
        <div style={css('display:flex;flex-direction:column;gap:6px')}>
          {vm.lists.map((l: any, i: number) => (
            <Box
              key={i}
              as="button"
              css={`display:flex;align-items:center;gap:11px;padding:11px 13px;border:1px solid ${l.bd};border-radius:10px;background:${l.bg};cursor:pointer;font-family:inherit;text-align:start`}
              hover="border-color:var(--bd2)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={l.fg} strokeWidth="1.8" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M9 10h6" />
              </svg>
              <span
                style={css(
                  `flex:1;font-size:12.5px;font-weight:600;color:${l.fg};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`,
                )}
              >
                {l.n}
              </span>
              <span style={css('font-size:11px;color:var(--mut)')}>{l.cnt}</span>
            </Box>
          ))}
        </div>
      </div>
      <div>
        <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:16px')}>
          <div
            style={css(
              'display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--sub);background:var(--card);border:1px solid var(--bd);border-radius:9px;padding:8px 12px',
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ac)">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            {t.autoCut} · ۴۲ {t.matches}
          </div>
          <div style={css('flex:1')}></div>
          <button
            onClick={v.toggleShowcase}
            style={css(
              'height:38px;padding:0 16px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px',
            )}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            {t.presentMode}
          </button>
        </div>
        <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:14px')}>
          {vm.clips.map((c: any, i: number) => (
            <Box
              key={i}
              css="background:var(--card);border:1px solid var(--bd);border-radius:13px;overflow:hidden;cursor:pointer"
              hover="border-color:var(--bd2)"
            >
              <div
                style={css(
                  'position:relative;aspect-ratio:16/9;background:repeating-linear-gradient(125deg,#1b1f26,#1b1f26 10px,#191d23 10px,#191d23 20px);display:flex;align-items:center;justify-content:center',
                )}
              >
                <div
                  style={css(
                    'width:40px;height:40px;border-radius:50%;background:rgba(13,15,18,.55);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.15)',
                  )}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span
                  style={css(
                    'position:absolute;bottom:7px;inset-inline-end:7px;background:rgba(13,15,18,.8);color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:5px',
                  )}
                >
                  {c.dur}
                </span>
                <span
                  style={css(
                    `position:absolute;top:7px;inset-inline-start:7px;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;color:${c.c};background:rgba(13,15,18,.7)`,
                  )}
                >
                  {c.ty}
                </span>
              </div>
              <div style={css('padding:11px 13px;display:flex;align-items:center;gap:10px')}>
                <div style={css('flex:1;font-size:12.5px;font-weight:600;line-height:1.4')}>{c.t}</div>
                <button
                  onClick={c.onBk}
                  title="بوکمارک"
                  style={css(
                    `width:28px;height:28px;border-radius:8px;background:var(--bg2);border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:${c.bkColor};flex-shrink:0`,
                  )}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={c.bkFill} stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 20.5l1.4-6.8L2.2 9l6.9-.7z" />
                  </svg>
                </button>
                <button
                  title={t.shareWith}
                  style={css(
                    'width:28px;height:28px;border-radius:8px;background:var(--bg2);border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--sub);flex-shrink:0',
                  )}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
                  </svg>
                </button>
              </div>
            </Box>
          ))}
        </div>
      </div>
      {v.showcase ? (
        <div
          style={css(
            'position:fixed;inset:0;z-index:60;background:#070809;display:flex;flex-direction:column',
          )}
        >
          <div style={css('display:flex;align-items:center;gap:12px;padding:18px 26px')}>
            <div
              style={css(
                'width:30px;height:30px;border-radius:9px;background:var(--ac);display:flex;align-items:center;justify-content:center',
              )}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 4 6v6c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V6l-8-4Z" fill="#0d0f12" />
                <path d="M12 7v10M7.5 9.5l9 5M16.5 9.5l-9 5" stroke="#a3e635" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={css('font-weight:700;font-size:14px')}>{t.showcase}</div>
              <div style={css('font-size:11.5px;color:var(--mut)')}>جلسه تیمی دوشنبه · ۱۸ کلیپ</div>
            </div>
            <div style={css('flex:1')}></div>
            <button
              onClick={v.toggleShowcase}
              style={css(
                'height:38px;padding:0 16px;background:var(--card);border:1px solid var(--bd2);border-radius:10px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px',
              )}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              خروج
            </button>
          </div>
          <div style={css('flex:1;display:flex;align-items:center;justify-content:center;padding:0 40px')}>
            <div style={css('width:100%;max-width:1100px')}>
              <div
                style={css(
                  'position:relative;aspect-ratio:16/9;border-radius:16px;background:repeating-linear-gradient(125deg,#13161b,#13161b 16px,#101317 16px,#101317 32px);display:flex;align-items:center;justify-content:center;border:1px solid var(--bd)',
                )}
              >
                <div
                  style={css(
                    'width:74px;height:74px;border-radius:50%;background:rgba(163,230,53,.92);display:flex;align-items:center;justify-content:center;cursor:pointer',
                  )}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#0d0f12">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span
                  style={css(
                    'position:absolute;top:16px;inset-inline-start:16px;display:inline-flex;align-items:center;gap:6px;background:var(--acd);color:var(--ac);font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px',
                  )}
                >
                  گل امیر حسینی — دقیقه ۳۸
                </span>
                <span
                  style={css(
                    'position:absolute;bottom:16px;inset-inline-end:16px;font-family:monospace;background:rgba(13,15,18,.8);color:#fff;font-size:13px;font-weight:700;padding:5px 12px;border-radius:8px',
                  )}
                >
                  ۰:۰۴ / ۰:۱۲
                </span>
              </div>
              <div style={css('display:flex;align-items:center;gap:16px;margin-top:20px')}>
                <button
                  style={css(
                    'width:44px;height:44px;border-radius:50%;background:var(--card);border:1px solid var(--bd2);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--tx)',
                  )}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 19 2 12l9-7zM22 19l-9-7 9-7z" />
                  </svg>
                </button>
                <div style={css('flex:1;display:flex;gap:6px;justify-content:center')}>
                  <span style={css('width:28px;height:5px;border-radius:6px;background:var(--ac)')}></span>
                  <span style={css('width:10px;height:5px;border-radius:6px;background:var(--bd2)')}></span>
                  <span style={css('width:10px;height:5px;border-radius:6px;background:var(--bd2)')}></span>
                  <span style={css('width:10px;height:5px;border-radius:6px;background:var(--bd2)')}></span>
                  <span style={css('width:10px;height:5px;border-radius:6px;background:var(--bd2)')}></span>
                </div>
                <button
                  style={css(
                    'width:44px;height:44px;border-radius:50%;background:var(--ac);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#0d0f12',
                  )}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 19l9-7-9-7zM2 19l9-7-9-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
