import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { Heatmap } from '../components/Heatmap'

// Ported from prototype lines 468–519. vm = v.vm (engine.vm_tactical()).
// Top block is REAL — the latest analysed video's true top-down pitch heatmap.
export function Tactical({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const single = !!rr.single_team || !!(job as any)?.single_override
  const hasReal = !!(rr.pitch_heatmap_a || rr.pitch_heatmap)
  const colorOf = (i: number) => rr.teams?.[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {job && hasReal ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:14px')}>{L('نقشه‌ی حرارتیِ تاپ‌ویوِ واقعی (متر)', 'Real top-down heatmap (metres)')}</div>
            <span style={css('font-size:11px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          {rr.pitch_heatmap_a && rr.pitch_heatmap_b && !single ? (
            <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
              <div>
                <div style={css('font-size:11px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px')}><span style={css(`width:11px;height:11px;border-radius:3px;background:${colorOf(0)}`)}></span>{L('تیم A', 'Team A')}</div>
                <Heatmap grid={rr.pitch_heatmap_a} />
              </div>
              <div>
                <div style={css('font-size:11px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px')}><span style={css(`width:11px;height:11px;border-radius:3px;background:${colorOf(1)}`)}></span>{L('تیم B', 'Team B')}</div>
                <Heatmap grid={rr.pitch_heatmap_b} />
              </div>
            </div>
          ) : (
            <Heatmap grid={rr.pitch_heatmap_a || rr.pitch_heatmap} />
          )}
        </div>
      ) : null}
      <div
        style={css(
          'display:flex;gap:6px;background:var(--card);border:1px solid var(--bd);border-radius:11px;padding:4px;margin-bottom:16px;width:fit-content;flex-wrap:wrap',
        )}
      >
        {vm.tacTabs.map((tb: any, i: number) => (
          <button
            key={i}
            onClick={tb.set}
            style={css(
              `padding:8px 16px;border:none;border-radius:8px;background:${tb.bg};color:${tb.fg};font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer`,
            )}
          >
            {tb.label}
          </button>
        ))}
      </div>
      <div
        style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px')}
      >
        {vm.metrics.map((m: any, i: number) => (
          <div
            key={i}
            style={css(
              `background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 17px;border-top:2px solid ${m.c}`,
            )}
          >
            <div style={css('display:flex;align-items:baseline;gap:7px')}>
              <span style={css(`font-size:13px;font-weight:800;color:${m.c}`)}>{m.k}</span>
            </div>
            <div style={css('font-size:26px;font-weight:800;margin:4px 0')}>{m.v}</div>
            <div style={css('font-size:11px;color:var(--mut)')}>{m.d}</div>
          </div>
        ))}
      </div>
      <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px')}>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}
        >
          <div
            style={css(
              'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px',
            )}
          >
            <div style={css('font-weight:700;font-size:14px')}>{vm.activeTitle}</div>
            <span
              style={css(
                'display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:var(--ai);background:var(--aid);padding:2px 8px;border-radius:20px',
              )}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              {t.confidence} ۹۴٪
            </span>
          </div>
          <div style={css('margin-top:10px')}>{vm.activeViz}</div>
        </div>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}
        >
          <div
            style={css(
              'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px',
            )}
          >
            <div
              style={css(
                'font-weight:700;font-size:14px;display:flex;align-items:center;gap:8px',
              )}
            >
              {t.fieldRadar}
              <span
                style={css(
                  'display:flex;gap:3px;background:var(--bg2);border-radius:7px;padding:2px',
                )}
              >
                <span
                  style={css(
                    'font-size:10px;font-weight:700;color:#0d0f12;background:var(--ac);padding:3px 8px;border-radius:5px',
                  )}
                >
                  2D
                </span>
                <span style={css('font-size:10px;font-weight:700;color:var(--sub);padding:3px 8px')}>
                  3D
                </span>
              </span>
            </div>
            <span
              style={css(
                'font-size:11px;color:var(--mut);display:flex;align-items:center;gap:5px',
              )}
            >
              <span style={css('width:8px;height:8px;border-radius:50%;background:var(--ac)')}></span>
              {t.us}
              <span
                style={css(
                  'width:8px;height:8px;border-radius:50%;background:var(--ai);margin-inline-start:6px',
                )}
              ></span>
              {t.them}
            </span>
          </div>
          <div style={css('margin-top:10px')}>{vm.fieldRadar}</div>
        </div>
      </div>
      <div
        style={css(
          'display:flex;align-items:flex-start;gap:11px;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px;margin-bottom:14px',
        )}
      >
        <span
          style={css(
            'width:30px;height:30px;border-radius:9px;background:var(--aid);display:flex;align-items:center;justify-content:center;flex-shrink:0',
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ai)" strokeWidth="1.8">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </span>
        <div>
          <div style={css('font-weight:700;font-size:13px;margin-bottom:3px')}>{t.oopShape}</div>
          <div style={css('font-size:12.5px;color:#cdd2d8;line-height:1.7')}>{vm.oop}</div>
        </div>
      </div>
      <div
        style={css(
          'background:linear-gradient(150deg,rgba(56,189,248,.06),var(--card) 55%);border:1px solid var(--bd);border-radius:14px;padding:18px 20px',
        )}
      >
        <div style={css('display:flex;align-items:center;gap:9px;margin-bottom:14px')}>
          <span
            style={css(
              'display:flex;align-items:center;gap:6px;background:var(--aid);color:var(--ai);font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px',
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            {t.discoveredPatterns}
          </span>
          <span
            style={css('margin-inline-start:auto;font-size:11px;font-weight:700;color:var(--sub)')}
          >
            {t.confidence} <b style={css('color:var(--ai)')}>۹۰٪</b>
          </span>
        </div>
        <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:14px')}>
          {vm.patterns.map((p: any, i: number) => (
            <div key={i} style={css('padding:13px;background:var(--bg2);border-radius:11px')}>
              <div style={css('display:flex;gap:9px;align-items:flex-start')}>
                <span
                  style={css(
                    'width:24px;height:24px;border-radius:7px;background:var(--aid);color:var(--ai);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:800',
                  )}
                >
                  {p.n}
                </span>
                <div style={css('font-size:12.5px;color:#cdd2d8;line-height:1.65')}>{p.text}</div>
              </div>
              <button
                onClick={p.onWhy}
                style={css(
                  'margin-top:9px;display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--ai);padding:0',
                )}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3M12 17h.01" strokeLinecap="round" />
                </svg>
                {p.whyLabel}
              </button>
              {p.open ? (
                <div
                  style={css(
                    'margin-top:8px;padding:10px 12px;background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.18);border-radius:9px;font-size:11.5px;color:#aeb6bf;line-height:1.7',
                  )}
                >
                  {p.explain}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
