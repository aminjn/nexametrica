import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 1130–1154. vm = v.vm (engine.vm_matrix()).
export function Matrix({ v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div
      style={css(
        'max-width:1320px;margin:0 auto;display:grid;grid-template-columns:1.1fr 1fr;gap:14px',
      )}
    >
      <div
        style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px 20px')}
      >
        <div
          style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:4px')}
        >
          <div style={css('font-weight:700;font-size:14px')}>{t.passMatrix}</div>
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
        <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:16px')}>{t.passMatrixDesc}</div>
        {vm.matrixEl}
      </div>
      <div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:14px',
          )}
        >
          <div
            style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:6px')}
          >
            <div style={css('font-weight:700;font-size:14px')}>{t.inCodeCharts}</div>
            <span style={css('font-size:11px;color:var(--ac)')}>{t.clickToPlay}</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:11px;margin-top:14px')}>
            {vm.eventBars.map((b: any, i: number) => (
              <Box
                key={i}
                css="display:flex;align-items:center;gap:12px;cursor:pointer"
                hover="opacity:.85"
              >
                <span style={css('min-width:50px;font-size:12px;color:var(--sub)')}>{b.k}</span>
                <div
                  style={css('flex:1;height:14px;background:var(--raised);border-radius:5px;overflow:hidden')}
                >
                  <div style={css(`height:100%;width:${b.pct};background:${b.c};border-radius:5px`)}></div>
                </div>
                <span
                  style={css(
                    'font-family:monospace;font-size:12px;font-weight:700;min-width:34px;text-align:end',
                  )}
                >
                  {b.vF}
                </span>
              </Box>
            ))}
          </div>
        </div>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}
        >
          <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{t.findOutput}</div>
          <div style={css('position:relative;margin-bottom:12px')}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--mut)"
              strokeWidth="2"
              style={css('position:absolute;inset-inline-start:11px;top:50%;transform:translateY(-50%)')}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              placeholder={t.search}
              style={css(
                'width:100%;height:38px;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;color:var(--tx);font-family:inherit;font-size:12.5px;padding-inline-start:36px;padding-inline-end:12px;outline:none',
              )}
            />
          </div>
          <div style={css('display:flex;flex-wrap:wrap;gap:7px')}>
            <span
              style={css(
                'font-size:11.5px;padding:6px 11px;background:var(--acd);border:1px solid rgba(163,230,53,.3);border-radius:20px;color:var(--ac);font-weight:700',
              )}
            >
              پاس کلیدی ۴۲
            </span>
            <span
              style={css(
                'font-size:11.5px;padding:6px 11px;background:var(--bg2);border:1px solid var(--bd);border-radius:20px;color:var(--sub)',
              )}
            >
              زمین حریف
            </span>
            <span
              style={css(
                'font-size:11.5px;padding:6px 11px;background:var(--bg2);border:1px solid var(--bd);border-radius:20px;color:var(--sub)',
              )}
            >
              نیمه دوم
            </span>
          </div>
          <button
            style={css(
              'width:100%;margin-top:14px;height:38px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer',
            )}
          >
            {t.export} →
          </button>
        </div>
      </div>
    </div>
  )
}
