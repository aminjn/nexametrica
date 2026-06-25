import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 341–414. vm = v.vm (engine.vm_player()).
export function Player({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div
      style={css(
        'max-width:1320px;margin:0 auto;display:grid;grid-template-columns:1fr 312px;gap:16px',
      )}
    >
      <div>
        <div
          style={css(
            'display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap',
          )}
        >
          <span style={css('font-size:11px;color:var(--mut);font-weight:700')}>{t.trackModes}:</span>
          <div
            style={css(
              'display:flex;gap:4px;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:4px',
            )}
          >
            <button
              style={css(
                'padding:7px 13px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:11.5px;font-weight:600;cursor:pointer',
              )}
            >
              {t.manualPitch}
            </button>
            <button
              style={css(
                'padding:7px 13px;border:none;border-radius:7px;background:var(--ac);color:#0d0f12;font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer',
              )}
            >
              {t.autoTrack}
            </button>
            <button
              style={css(
                'padding:7px 13px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:11.5px;font-weight:600;cursor:pointer',
              )}
            >
              {t.fullClip}
            </button>
          </div>
          <div style={css('flex:1')}></div>
          <span
            style={css(
              'display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ai);background:var(--aid);border-radius:20px;padding:5px 12px;font-weight:700',
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="5" r="2.5" />
              <path d="M12 7.5V14M12 14l-4 6M12 14l4 6M7 10h10" />
            </svg>
            ۲۲ {t.trackedPlayers}
          </span>
        </div>
        <div
          style={css('background:#0a0c0f;border:1px solid var(--bd);border-radius:14px;overflow:hidden')}
        >
          <div
            style={css(
              'position:relative;aspect-ratio:16/9;background:repeating-linear-gradient(120deg,#13161b,#13161b 14px,#101317 14px,#101317 28px);display:flex;align-items:center;justify-content:center',
            )}
          >
            <span
              style={css(
                'position:absolute;top:12px;inset-inline-start:12px;display:inline-flex;align-items:center;gap:6px;background:var(--aid);color:var(--ai);font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px',
              )}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              {t.autoTracking}
            </span>
            <span
              style={css(
                'position:absolute;top:12px;inset-inline-end:12px;font-family:monospace;background:rgba(13,15,18,.8);color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:7px',
              )}
            >
              ۳۸:۴۵ / ۹۴:۱۲
            </span>
            <div
              style={css(
                'width:64px;height:64px;border-radius:50%;background:rgba(163,230,53,.9);display:flex;align-items:center;justify-content:center;cursor:pointer',
              )}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0d0f12">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div
            style={css(
              'padding:12px 14px;display:flex;align-items:center;gap:14px;border-top:1px solid var(--bd)',
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--sub)">
              <path d="M6 4l12 8-12 8z" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2">
              <path d="M5 4h4v16H5zM15 4h4v16h-4z" />
            </svg>
            <div
              style={css('flex:1;height:5px;background:var(--raised);border-radius:6px;position:relative')}
            >
              <div style={css('width:41%;height:100%;background:var(--ac);border-radius:6px')}></div>
              <div
                style={css(
                  'position:absolute;inset-inline-start:41%;top:50%;transform:translate(-50%,-50%);width:12px;height:12px;border-radius:50%;background:var(--ac);box-shadow:0 0 0 3px rgba(163,230,53,.2)',
                )}
              ></div>
            </div>
            <span style={css('font-family:monospace;font-size:12px;color:var(--sub)')}>×۱</span>
          </div>
        </div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px 16px;margin-top:14px',
          )}
        >
          <div
            style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:12px')}
          >
            <div style={css('font-weight:700;font-size:13px')}>{t.eventTimeline}</div>
            <div style={css('font-size:11px;color:var(--mut)')}>{t.syncedEvents}</div>
          </div>
          <div
            style={css('position:relative;height:46px;background:var(--bg2);border-radius:9px;overflow:hidden')}
          >
            <div
              style={css(
                'position:absolute;top:0;bottom:0;inset-inline-start:0;width:1px;background:var(--bd);opacity:.5',
              )}
            ></div>
            {vm.events.map((e: any, i: number) => (
              <Box
                key={i}
                title={e.ty}
                css={`position:absolute;top:7px;bottom:7px;inset-inline-start:${e.p}%;width:4px;border-radius:3px;background:${e.c};cursor:pointer`}
                hover="transform:scaleX(1.8)"
              ></Box>
            ))}
            <div
              style={css('position:absolute;top:0;bottom:0;inset-inline-start:41%;width:2px;background:#fff')}
            ></div>
          </div>
          <div
            style={css(
              'display:flex;justify-content:space-between;font-size:10px;color:var(--mut);font-family:monospace;margin-top:6px',
            )}
          >
            <span>۰:۰۰</span>
            <span>۴۵:۰۰</span>
            <span>۹۰:۰۰</span>
          </div>
        </div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px;margin-top:14px',
          )}
        >
          <div style={css('font-weight:700;font-size:13px;margin-bottom:12px')}>{t.detectedEvents}</div>
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            {vm.eventList.map((e: any, i: number) => (
              <div
                key={i}
                style={css(
                  'display:flex;align-items:center;gap:12px;padding:9px 11px;background:var(--bg2);border-radius:9px',
                )}
              >
                <span
                  style={css('font-family:monospace;font-size:12px;color:var(--mut);min-width:42px')}
                >
                  {e.t}
                </span>
                <span style={css('font-weight:600;font-size:13px;flex:1')}>{e.ty}</span>
                {e.auto ? (
                  <span
                    style={css(
                      `display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:${e.confC};background:rgba(255,255,255,.05);padding:2px 8px;border-radius:20px`,
                    )}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                    </svg>
                    {e.conf}٪
                  </span>
                ) : null}
                <button
                  style={css(
                    'width:26px;height:26px;border-radius:7px;background:transparent;border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--sub)',
                  )}
                  title={t.correct}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px')}>
          <div
            style={css(
              'display:flex;background:var(--bg2);border-radius:9px;padding:3px;margin-bottom:14px',
            )}
          >
            <button
              style={css(
                'flex:1;padding:7px;border:none;border-radius:7px;background:var(--ac);color:#0d0f12;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
              )}
            >
              {t.livePost}
            </button>
            <button
              style={css(
                'flex:1;padding:7px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
              )}
            >
              {t.liveTag}
            </button>
          </div>
          <div style={css('font-size:11px;color:var(--mut);font-weight:700;margin-bottom:10px')}>
            {t.tagPalette}
          </div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:8px')}>
            {vm.tags.map((tg: any, i: number) => (
              <Box
                key={i}
                as="button"
                css="display:flex;align-items:center;gap:8px;padding:10px 11px;background:var(--bg2);border:1px solid var(--bd);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer"
                hover="border-color:var(--bd2)"
              >
                <span style={css(`width:9px;height:9px;border-radius:3px;background:${tg.c}`)}></span>
                {tg.label}
              </Box>
            ))}
          </div>
          <button
            style={css(
              'width:100%;margin-top:12px;padding:10px;background:transparent;border:1px dashed var(--bd2);border-radius:9px;color:var(--sub);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
            )}
          >
            + {t.customCode}
          </button>
          <div
            style={css(
              'margin-top:16px;padding:13px;background:linear-gradient(160deg,rgba(56,189,248,.08),transparent);border:1px solid rgba(56,189,248,.2);border-radius:10px',
            )}
          >
            <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:7px')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ai)">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              <span style={css('font-size:12px;font-weight:700;color:var(--ai)')}>{t.aiSuggests}</span>
            </div>
            <div style={css('font-size:12px;color:#cdd2d8;line-height:1.6')}>{t.aiTagHint}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
