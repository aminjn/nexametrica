import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 1005–1045. vm = v.vm (engine.vm_settings()).
export function Settings({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div style={css('max-width:1100px;margin:0 auto')}>
      <div
        style={css(
          'display:flex;gap:6px;background:var(--card);border:1px solid var(--bd);border-radius:11px;padding:4px;margin-bottom:16px;width:fit-content;flex-wrap:wrap',
        )}
      >
        <button
          style={css(
            'padding:8px 16px;border:none;border-radius:8px;background:var(--ac);color:#0d0f12;font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer',
          )}
        >
          {t.usersRoles}
        </button>
        <button
          style={css(
            'padding:8px 16px;border:none;border-radius:8px;background:transparent;color:var(--sub);font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer',
          )}
        >
          {t.teams}
        </button>
        <button
          style={css(
            'padding:8px 16px;border:none;border-radius:8px;background:transparent;color:var(--sub);font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer',
          )}
        >
          {t.seasons}
        </button>
        <button
          style={css(
            'padding:8px 16px;border:none;border-radius:8px;background:transparent;color:var(--sub);font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer',
          )}
        >
          {t.general}
        </button>
      </div>
      <div style={css('display:grid;grid-template-columns:1.5fr 1fr;gap:14px')}>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;overflow:hidden')}>
          <div
            style={css(
              'display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--bd)',
            )}
          >
            <div style={css('font-weight:700;font-size:14px')}>{t.usersRoles}</div>
            <button
              style={css(
                'height:32px;padding:0 13px;background:var(--card2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
              )}
            >
              {t.addUser}
            </button>
          </div>
          <div
            style={css(
              'display:flex;font-size:11px;color:var(--mut);font-weight:700;padding:10px 18px;background:var(--bg2)',
            )}
          >
            <span style={css('flex:1')}>{t.name}</span>
            <span style={css('width:110px')}>{t.role}</span>
            <span style={css('width:70px;text-align:center')}>{t.access}</span>
          </div>
          {vm.users.map((u: any, i: number) => (
            <div
              key={i}
              style={css(
                'display:flex;align-items:center;font-size:13px;padding:12px 18px;border-bottom:1px solid var(--bd)',
              )}
            >
              <span style={css('flex:1;display:flex;align-items:center;gap:11px')}>
                <span
                  style={css(
                    'width:32px;height:32px;border-radius:50%;background:var(--raised);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--sub)',
                  )}
                >
                  {u.ini}
                </span>
                <span style={css('font-weight:600')}>{u.name}</span>
              </span>
              <span style={css('width:110px')}>
                <span
                  style={css(
                    `font-size:11px;font-weight:700;color:${u.rc};background:rgba(255,255,255,.05);padding:3px 10px;border-radius:20px`,
                  )}
                >
                  {u.role}
                </span>
              </span>
              <span style={css('width:70px;text-align:center')}>
                <span
                  style={css(
                    'display:inline-block;width:34px;height:19px;border-radius:20px;background:var(--acd);position:relative;cursor:pointer',
                  )}
                >
                  <span
                    style={css(
                      'position:absolute;inset-inline-end:2px;top:2px;width:15px;height:15px;border-radius:50%;background:var(--ac)',
                    )}
                  ></span>
                </span>
              </span>
            </div>
          ))}
        </div>
        <div style={css('display:flex;flex-direction:column;gap:14px')}>
          <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
            <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{t.general}</div>
            <div
              style={css(
                'display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--bd)',
              )}
            >
              <span style={css('font-size:13px;color:var(--sub)')}>{t.language}</span>
              <div style={css('display:flex;gap:4px;background:var(--bg2);border-radius:8px;padding:3px')}>
                <button
                  onClick={v.setFa}
                  style={css(
                    `padding:6px 14px;border:none;border-radius:6px;background:${v.faBtnBg};color:${v.faBtnFg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`,
                  )}
                >
                  فارسی
                </button>
                <button
                  onClick={v.setEn}
                  style={css(
                    `padding:6px 14px;border:none;border-radius:6px;background:${v.enBtnBg};color:${v.enBtnFg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`,
                  )}
                >
                  English
                </button>
              </div>
            </div>
            <div
              style={css(
                'display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--bd)',
              )}
            >
              <span style={css('font-size:13px;color:var(--sub)')}>{t.team}</span>
              <span style={css('font-size:12.5px;font-weight:600')}>پارس تهران ▾</span>
            </div>
            <div
              style={css('display:flex;align-items:center;justify-content:space-between;padding:11px 0')}
            >
              <span style={css('font-size:13px;color:var(--sub)')}>{t.season}</span>
              <span style={css('font-size:12.5px;font-weight:600')}>۱۴۰۳–۰۴ ▾</span>
            </div>
          </div>
          <div
            style={css(
              'background:linear-gradient(160deg,rgba(56,189,248,.07),var(--card) 55%);border:1px solid rgba(56,189,248,.2);border-radius:14px;padding:18px',
            )}
          >
            <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:8px')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--ai)">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              <span style={css('font-weight:700;font-size:13px;color:var(--ai)')}>{t.aiName}</span>
            </div>
            <div style={css('font-size:12px;color:#cdd2d8;line-height:1.65')}>
              دستیار برای هر کاربر جداگانه شخصی‌سازی می‌شود. تنظیمات شخصی‌سازی در صفحه دستیار هوشمند در دسترس است.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
