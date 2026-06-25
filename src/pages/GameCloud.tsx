import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 1047–1088. vm = v.vm (engine.vm_gamecloud()).
export function GameCloud({ v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <div style={css('display:grid;grid-template-columns:1.5fr 1fr;gap:14px;margin-bottom:14px')}>
        <div
          style={css(
            'background:linear-gradient(150deg,rgba(56,189,248,.1),var(--card) 55%);border:1px solid rgba(56,189,248,.22);border-radius:14px;padding:20px',
          )}
        >
          <div
            style={css('display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px')}
          >
            <div>
              <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:6px')}>{t.creditsLeft}</div>
              <div style={css('display:flex;align-items:baseline;gap:8px')}>
                <span style={css('font-size:34px;font-weight:800;color:var(--ai)')}>۸٬۴۲۰</span>
                <span style={css('font-size:13px;color:var(--mut)')}>{t.matches} ≈ ۸۹</span>
              </div>
            </div>
            <button
              style={css(
                'height:38px;padding:0 16px;background:var(--ai);border:none;border-radius:10px;color:#06141f;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer',
              )}
            >
              {t.buyCredits}
            </button>
          </div>
          <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:8px')}>
            {t.creditUsage} · {t.perMin}
          </div>
          {vm.usage}
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px')}>
          <div
            style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:16px')}
          >
            <div style={css('font-weight:700;font-size:14px')}>{t.storageUsed}</div>
            <span style={css('font-size:12.5px;color:var(--mut)')}>۱٫۸ / ۵ TB</span>
          </div>
          <div
            style={css(
              'height:10px;background:var(--raised);border-radius:6px;overflow:hidden;display:flex;margin-bottom:18px',
            )}
          >
            <div style={css('width:62%;background:var(--ac)')}></div>
            <div style={css('width:26%;background:var(--ai)')}></div>
            <div style={css('width:12%;background:var(--warn)')}></div>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:13px')}>
            {vm.breakdown.map((b: any, i: number) => (
              <div key={i} style={css('display:flex;align-items:center;gap:10px')}>
                <span style={css(`width:10px;height:10px;border-radius:3px;background:${b.c};flex-shrink:0`)}></span>
                <span style={css('flex:1;font-size:12.5px;color:var(--sub)')}>{b.k}</span>
                <span style={css('font-size:12.5px;font-weight:700;font-family:monospace')}>{b.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={css('display:grid;grid-template-columns:1fr 1.3fr;gap:14px')}>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px')}>
            <span
              style={css(
                'display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;color:var(--ai);background:var(--aid);padding:3px 9px;border-radius:20px',
              )}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              AI
            </span>
            <div style={css('font-weight:700;font-size:14px')}>{t.coordExport}</div>
          </div>
          <div style={css('font-size:12.5px;color:var(--sub);line-height:1.7;margin-bottom:16px')}>
            {t.coordDesc}
          </div>
          <div
            style={css(
              'background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:13px;font-family:monospace;font-size:11px;color:var(--mut);line-height:1.8;margin-bottom:14px',
            )}
          >
            frame,team,player,x,y<br />1042,home,7,68.4,21.1<br />1042,away,4,33.9,52.7<br />1042,ball,—,71.2,19.8
          </div>
          <div style={css('display:flex;gap:8px')}>
            <button
              style={css(
                'flex:1;height:36px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
              )}
            >
              CSV
            </button>
            <button
              style={css(
                'flex:1;height:36px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
              )}
            >
              JSON
            </button>
            <button
              style={css(
                'flex:1;height:36px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
              )}
            >
              XML
            </button>
          </div>
        </div>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{t.cloudActivity}</div>
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            {vm.activity.map((a: any, i: number) => (
              <div
                key={i}
                style={css(
                  'display:flex;align-items:center;gap:12px;padding:11px 13px;background:var(--bg2);border-radius:10px',
                )}
              >
                <span style={css(`width:8px;height:8px;border-radius:50%;background:${a.c};flex-shrink:0`)}></span>
                <div style={css('flex:1')}>
                  <div style={css('font-size:12.5px;font-weight:600')}>{a.a}</div>
                  <div style={css('font-size:11px;color:var(--mut)')}>{a.t}</div>
                </div>
                <span style={css(`font-family:monospace;font-size:11.5px;font-weight:700;color:${a.c}`)}>{a.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
