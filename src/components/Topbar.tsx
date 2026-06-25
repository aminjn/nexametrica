import { Box } from './Box'
import { css } from '../lib/css'
import type { PageProps } from '../pages/types'

// Ported from prototype lines 79–120: page title, search, role switcher (with
// outside-click overlay), language toggle, notifications, assistant button.
export function Topbar({ v, ui }: PageProps & { ui?: any }) {
  const isMobile = !!ui?.isMobile
  return (
    <header
      style={css(
        (isMobile
          ? 'height:58px;gap:8px;padding:0 12px;'
          : 'height:62px;gap:14px;padding:0 22px;') +
          'flex-shrink:0;border-bottom:1px solid var(--bd);background:rgba(13,15,18,.8);backdrop-filter:blur(10px);display:flex;align-items:center;z-index:20',
      )}
    >
      {isMobile ? (
        <button
          onClick={() => ui?.setNavOpen?.(!ui?.navOpen)}
          aria-label="menu"
          style={css(
            'width:38px;height:38px;flex-shrink:0;background:var(--card);border:1px solid var(--bd);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--tx)',
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      ) : null}
      <div style={css('flex:1;display:flex;align-items:center;gap:14px;min-width:0')}>
        <div style={css('min-width:0')}>
          <div
            style={css(
              (isMobile ? 'font-size:14px;' : 'font-size:16px;') +
                'font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
            )}
          >
            {v.pageTitle}
          </div>
          {isMobile ? null : (
            <div style={css('font-size:11.5px;color:var(--mut)')}>{v.pageSub}</div>
          )}
        </div>
      </div>

      {isMobile ? null : (
      <div style={css('position:relative;width:280px;max-width:30vw')}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--mut)"
          strokeWidth="2"
          style={css('position:absolute;inset-inline-start:11px;top:50%;transform:translateY(-50%)')}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <Box
          as="input"
          placeholder={v.t.search}
          css="width:100%;height:38px;background:var(--card);border:1px solid var(--bd);border-radius:10px;color:var(--tx);font-family:inherit;font-size:13px;padding-inline-start:36px;padding-inline-end:12px;outline:none"
          focus="border-color:var(--ac)"
        />
      </div>
      )}

      <div style={css('position:relative')}>
        <div
          onClick={v.toggleRoleMenu}
          style={css(
            `position:fixed;inset:0;z-index:49;opacity:${v.roleMenuOpacity};pointer-events:${v.roleMenuPointer}`,
          )}
        ></div>
        <Box
          as="button"
          onClick={v.toggleRoleMenu}
          css="height:38px;padding:0 12px;background:var(--card);border:1px solid var(--bd);border-radius:10px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;position:relative;z-index:51"
          hover="border-color:var(--bd2)"
        >
          <span
            style={css(
              `width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#3a4150,#21262e);display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:800;color:${v.roleColor}`,
            )}
          >
            {v.roleIni}
          </span>
          {isMobile ? null : v.roleLabel}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--mut)" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Box>
        <div
          style={css(
            `position:absolute;top:46px;inset-inline-end:0;width:236px;background:var(--bg2);border:1px solid var(--bd2);border-radius:12px;padding:7px;box-shadow:0 18px 44px rgba(0,0,0,.5);z-index:50;opacity:${v.roleMenuOpacity};pointer-events:${v.roleMenuPointer};transform:${v.roleMenuTransform};transition:opacity .18s,transform .18s`,
          )}
        >
          <div style={css('font-size:10px;color:var(--mut);font-weight:700;padding:6px 9px 8px')}>
            {v.t.viewAs}
          </div>
          {v.roleList.map((r: any) => (
            <Box
              key={r.key}
              as="button"
              onClick={r.set}
              css={`width:100%;display:flex;align-items:center;gap:10px;padding:9px 10px;border:none;border-radius:9px;background:${r.bg};cursor:pointer;font-family:inherit;text-align:start`}
              hover="background:var(--card2)"
            >
              <span
                style={css(
                  `width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#3a4150,#21262e);display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:800;color:${r.color};flex-shrink:0`,
                )}
              >
                {r.ini}
              </span>
              <span style={css('flex:1;font-size:12.5px;font-weight:600;color:var(--tx)')}>
                {r.label}
              </span>
              <span style={css(`width:8px;height:8px;border-radius:50%;background:${r.dot}`)}></span>
            </Box>
          ))}
        </div>
      </div>

      <Box
        as="button"
        onClick={v.toggleLang}
        css="height:38px;padding:0 13px;background:var(--card);border:1px solid var(--bd);border-radius:10px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:7px"
        hover="border-color:var(--bd2)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="1.7">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        {v.t.langSwitch}
      </Box>

      <Box
        as="button"
        css={`position:relative;width:38px;height:38px;background:var(--card);border:1px solid var(--bd);border-radius:10px;cursor:pointer;align-items:center;justify-content:center;display:${isMobile ? 'none' : 'flex'}`}
        hover="border-color:var(--bd2)"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--sub)"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        <span
          style={css(
            'position:absolute;top:7px;inset-inline-end:8px;width:7px;height:7px;border-radius:50%;background:var(--ac);border:1.5px solid var(--card)',
          )}
        ></span>
      </Box>

      <Box
        as="button"
        onClick={v.toggleAI}
        css="height:38px;padding:0 15px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(163,230,53,.22)"
        hover="filter:brightness(1.06)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0d0f12">
          <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10l6-1.6Z" />
          <circle cx="19" cy="5" r="1.6" />
          <circle cx="5" cy="18" r="1.3" />
        </svg>
        {v.t.assistant}
      </Box>
    </header>
  )
}
