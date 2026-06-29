import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Ported from prototype lines 1130–1154. vm = v.vm (engine.vm_matrix()).
// Top block is REAL — event timeline + top passing combinations from the analysis.
export function Matrix({ v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const P = rr.physical?.passes
  const events: any[] = P?.events || []
  const edges: any[] = P?.edges || []
  const nodes: any[] = P?.nodes || []
  const numOf = (id: number) => nodes.find((n) => n.id === id)?.number
  const teamsMeta = rr.teams || []
  const colorOf = (i: number) => teamsMeta[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')
  const dur = rr.video?.duration_sec || (events.length ? events[events.length - 1].t : 1)
  const lbl = (id: number) => (numOf(id) ? `#${faN(numOf(id))}` : `${L('ب', 'P')}${faN(id)}`)

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {events.length || edges.length ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('تایم‌لاین و ماتریسِ پاس', 'Timeline & passing matrix')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          {/* event timeline */}
          <div style={css('font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:8px')}>{L('تایم‌لاینِ رویدادها', 'Event timeline')}</div>
          <div style={css('position:relative;height:26px;background:var(--bg2);border:1px solid var(--bd);border-radius:7px;overflow:hidden;margin-bottom:18px')}>
            {events.map((ev, i) => (
              <div key={i} title={`${ev.type} · ${Math.round(ev.t)}s`}
                style={{ position: 'absolute', top: ev.type === 'pass' ? '5px' : '13px', left: `${Math.min(99, (ev.t / dur) * 100)}%`, width: '3px', height: '8px', borderRadius: '2px', background: colorOf(ev.team), opacity: ev.type === 'pass' ? 0.9 : 0.5 }} />
            ))}
          </div>
          {/* top passing combinations */}
          <div style={css('font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:8px')}>{L('پرتکرارترین پاس‌ها (چه‌کسی به چه‌کسی)', 'Top passing combinations (who → whom)')}</div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:6px')}>
            {edges.slice(0, 16).map((e, i) => (
              <div key={i} style={css('display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:6px 10px')}>
                <span style={css(`width:9px;height:9px;border-radius:3px;background:${colorOf(e.team)}`)}></span>
                <span style={css('font-size:12px;font-weight:700;flex:1')}>{lbl(e.from)} <span style={css('color:var(--mut)')}>→</span> {lbl(e.to)}</span>
                <span style={css('font-size:12px;font-weight:800;color:var(--ac)')}>{faN(e.count)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز رویدادِ واقعی‌ای نیست. یک ویدیوی دوتیمی آنالیز کن. نمونه‌ی زیر دموی طراحی است.',
            'No real events yet. Analyse a two-team video. The sample below is a design demo.')}
        </div>
      )}
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
      </div>
    <div
      style={css(
        'display:grid;grid-template-columns:1.1fr 1fr;gap:14px',
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
    </div>
  )
}
