import { Box } from './Box'
import { css } from '../lib/css'
import type { PageProps } from '../pages/types'

// Ported from prototype lines 29–76: brand, accordion nav groups (with collapse,
// children sub-items, AI badges) and the role identity chip.
export function Sidebar({ v }: PageProps) {
  return (
    <aside
      style={css(
        'width:248px;flex-shrink:0;background:var(--bg2);border-inline-start:1px solid var(--bd);height:100vh;position:sticky;top:0;display:flex;flex-direction:column',
      )}
    >
      <div
        style={css(
          'padding:20px 20px 16px;display:flex;align-items:center;gap:11px;border-bottom:1px solid var(--bd)',
        )}
      >
        <div
          style={css(
            'width:38px;height:38px;border-radius:10px;background:var(--ac);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(163,230,53,.25)',
          )}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 4 6v6c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V6l-8-4Z" fill="#0d0f12" />
            <path
              d="M12 7v10M7.5 9.5l9 5M16.5 9.5l-9 5"
              stroke="#a3e635"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={css('min-width:0')}>
          <div style={css('font-weight:800;font-size:15px;letter-spacing:.2px')}>{v.t.brand}</div>
          <div style={css('font-size:10.5px;color:var(--mut);letter-spacing:.3px')}>
            {v.t.brandSub}
          </div>
        </div>
      </div>

      <nav style={css('flex:1;overflow-y:auto;padding:10px 12px 20px')}>
        {v.navGroups.map((grp: any, gi: number) => (
          <div key={gi} style={css('margin-top:10px')}>
            <Box
              as="button"
              onClick={grp.toggle}
              css="width:100%;display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:10px;font-weight:700;color:var(--mut);letter-spacing:1px;padding:4px 10px 7px;text-align:start"
              hover="color:var(--sub)"
            >
              <span style={css('flex:1')}>{grp.label}</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                style={{ transform: grp.chevron, transition: 'transform .18s' }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Box>
            {grp.shown.map((it: any) => (
              <div key={it.id}>
                <Box
                  as="button"
                  onClick={it.go}
                  css={`width:100%;display:flex;align-items:center;gap:11px;padding:9px 11px;margin-bottom:2px;border:none;border-radius:9px;cursor:pointer;background:${it.bg};color:${it.fg};font-family:inherit;font-size:13px;font-weight:${it.w};text-align:start`}
                  hover="box-shadow:inset 0 0 0 1px var(--bd2)"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={it.fg}
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <path d={it.icon} />
                  </svg>
                  <span
                    style={css(
                      'flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                    )}
                  >
                    {it.label}
                  </span>
                  {it.badge ? (
                    <span
                      style={css(
                        'font-size:10px;font-weight:700;background:var(--acd);color:var(--ac);padding:1px 6px;border-radius:20px',
                      )}
                    >
                      {it.badge}
                    </span>
                  ) : null}
                </Box>
                {it.kids ? (
                  <div style={css('margin:0 0 4px;padding-inline-start:18px')}>
                    {it.kids.map((ch: any, ci: number) => (
                      <Box
                        key={ci}
                        as="button"
                        onClick={ch.go}
                        css={`width:100%;display:flex;align-items:center;gap:9px;padding:6px 11px;margin-bottom:1px;border:none;border-radius:8px;cursor:pointer;background:${ch.bg};color:${ch.fg};font-family:inherit;font-size:12px;font-weight:${ch.w};text-align:start`}
                        hover="background:var(--bg2)"
                      >
                        <span
                          style={css(
                            'width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;opacity:.7',
                          )}
                        ></span>
                        <span
                          style={css(
                            'flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                          )}
                        >
                          {ch.label}
                        </span>
                      </Box>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div
        style={css(
          'padding:12px;border-top:1px solid var(--bd);display:flex;align-items:center;gap:10px',
        )}
      >
        <div
          style={css(
            `width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3a4150,#21262e);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:${v.roleColor};flex-shrink:0`,
          )}
        >
          {v.roleIni}
        </div>
        <div style={css('flex:1;min-width:0')}>
          <div
            style={css(
              'font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
            )}
          >
            {v.roleName}
          </div>
          <div style={css(`font-size:10.5px;color:${v.roleColor}`)}>{v.roleLabel}</div>
        </div>
        <div
          style={css(
            'width:8px;height:8px;border-radius:50%;background:var(--good);box-shadow:0 0 8px var(--good)',
          )}
        ></div>
      </div>
    </aside>
  )
}
