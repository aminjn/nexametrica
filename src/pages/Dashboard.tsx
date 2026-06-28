import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Ported from prototype lines 124–240. vm = v.vm (engine.vm_dashboard()).
// Top strip is REAL — latest analysed video; the rest is a labelled design sample.
export function Dashboard({ v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const phys = (job as any)?.result?.physical

  let real: [string, string, string][] | null = null
  if (phys?.players?.length) {
    const totalM =
      (phys.teams || []).reduce((s: number, tm: any) => s + (tm.distance_total_m || 0), 0) ||
      phys.players.reduce((s: number, p: any) => s + (p.distance_m || 0), 0)
    const top = Math.max(...phys.players.map((p: any) => p.max_speed_kmh || 0))
    real = [
      [L('مسافتِ کل', 'Total distance'), faN((totalM / 1000).toFixed(2)), ' km'],
      [L('بیشینه سرعت', 'Top speed'), faN(Math.round(top * 10) / 10), ' km/h'],
      [L('بازیکنان (Re-ID)', 'Players (Re-ID)'), faN(phys.player_count), ''],
      [L('تعداد اسپرینت', 'Sprints'), faN(phys.sprints ?? 0), ''],
    ]
  }

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {job && real ? (
        <div style={css('margin-bottom:18px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('آخرین ویدیوی آنالیزشده', 'Latest analysed video')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
            <a href="#physical" onClick={(ev) => { ev.preventDefault(); (v as any).go?.('physical') }} style={css('font-size:11.5px;color:var(--ac);text-decoration:none;cursor:pointer')}>{L('آنالیز فیزیکی ←', 'Physical analysis →')}</a>
          </div>
          <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px')}>
            {real.map(([lab, val, unit], i) => (
              <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px')}>
                <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>{lab}</div>
                <div style={css('font-size:24px;font-weight:800')}>{val}<span style={css('font-size:12px;color:var(--mut);font-weight:600')}>{unit}</span></div>
              </div>
            ))}
          </div>
          {(job as any).result?.possession && (job as any).result?.teams && !(job as any).result?.single_team ? (
            <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px 17px;margin-top:14px')}>
              <div style={css('display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:8px')}>
                <span style={css('color:var(--sub)')}>{L('مالکیتِ توپ (واقعی)', 'Ball possession (real)')}</span>
                <span style={css('color:var(--mut)')}>{L('A', 'A')} {faN((job as any).result.possession.a)}٪ · {L('B', 'B')} {faN((job as any).result.possession.b)}٪</span>
              </div>
              <div style={css('height:11px;border-radius:6px;overflow:hidden;display:flex')}>
                <div style={css(`width:${(job as any).result.possession.a}%;background:${(job as any).result.teams[0].color}`)}></div>
                <div style={css(`width:${(job as any).result.possession.b}%;background:${(job as any).result.teams[1].color}`)}></div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
        <span style={css('font-size:11px;color:var(--mut)')}>{L('xG/مالکیت/پرس — با تشخیصِ رویداد واقعی می‌شوند', 'xG/possession/press — become real with event detection')}</span>
      </div>
      <div
        style={css(
          'display:flex;align-items:center;gap:12px;margin-bottom:18px;flex-wrap:wrap',
        )}
      >
        <div
          style={css(
            'display:flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:7px 13px',
          )}
        >
          <div
            style={css(
              'width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#a3e635,#65a30d);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;color:#0d0f12',
            )}
          >
            پت
          </div>
          <div style={css('font-weight:700;font-size:13px')}>{t.team}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--mut)" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        <div style={css('font-size:12.5px;color:var(--mut)')}>
          {t.season} · {t.league}
        </div>
        <div style={css('flex:1')}></div>
        <div style={css('display:flex;gap:8px')}>
          <Box
            as="button"
            css="height:36px;padding:0 14px;background:var(--card);border:1px solid var(--bd);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer"
            hover="border-color:var(--bd2)"
          >
            {t.export}
          </Box>
          <button
            style={css(
              'height:36px;padding:0 14px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer',
            )}
          >
            {t.newAnalysis}
          </button>
        </div>
      </div>

      <div
        style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px')}
      >
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px;position:relative;overflow:hidden',
          )}
        >
          <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>{t.lastMatch}</div>
          <div style={css('display:flex;align-items:center;gap:8px')}>
            <span style={css('font-size:24px;font-weight:800;letter-spacing:.5px')}>۲–۱</span>
            <span
              style={css(
                'font-size:10.5px;font-weight:800;color:var(--good);background:rgba(74,222,128,.14);padding:2px 8px;border-radius:20px',
              )}
            >
              {t.win}
            </span>
          </div>
          <div style={css('font-size:12px;color:var(--mut);margin-top:6px')}>
            {t.vs} زاگرس اصفهان · {t.home}
          </div>
        </div>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px')}
        >
          <div
            style={css(
              'display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--sub);margin-bottom:9px',
            )}
          >
            xG ({t.expGoals})
          </div>
          <div style={css('display:flex;align-items:baseline;gap:7px')}>
            <span style={css('font-size:24px;font-weight:800;color:var(--ac)')}>۱٫۸۴</span>
            <span style={css('font-size:12px;color:var(--mut)')}>{t.vs} ۰٫۹۷</span>
          </div>
          <div
            style={css(
              'height:5px;background:var(--raised);border-radius:6px;margin-top:11px;overflow:hidden;display:flex',
            )}
          >
            <div style={css('width:65%;background:var(--ac)')}></div>
            <div style={css('flex:1')}></div>
          </div>
        </div>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px')}
        >
          <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>{t.possession}</div>
          <div style={css('font-size:24px;font-weight:800')}>۵۸٪</div>
          <div style={css('display:flex;gap:3px;margin-top:11px')}>{vm.possBars}</div>
        </div>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px')}
        >
          <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>
            PPDA · {t.pressInt}
          </div>
          <div style={css('display:flex;align-items:baseline;gap:7px')}>
            <span style={css('font-size:24px;font-weight:800')}>۸٫۴</span>
            <span style={css('font-size:11px;font-weight:700;color:var(--good)')}>↓ ۱۲٪</span>
          </div>
          <div style={css('font-size:11.5px;color:var(--mut);margin-top:6px')}>{t.higherPress}</div>
        </div>
      </div>

      <div style={css('display:grid;grid-template-columns:1.6fr 1fr;gap:14px;margin-bottom:14px')}>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px 19px')}
        >
          <div
            style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:6px')}
          >
            <div>
              <div style={css('font-weight:700;font-size:14px')}>{t.xgTrendTitle}</div>
              <div style={css('font-size:11.5px;color:var(--mut)')}>
                {t.lastN} ۱۰ {t.matches}
              </div>
            </div>
            <div style={css('display:flex;gap:14px;font-size:11.5px')}>
              <span style={css('display:flex;align-items:center;gap:5px')}>
                <span style={css('width:9px;height:9px;border-radius:2px;background:var(--ac)')}></span>
                {t.xgFor}
              </span>
              <span style={css('display:flex;align-items:center;gap:5px;color:var(--sub)')}>
                <span style={css('width:9px;height:9px;border-radius:2px;background:var(--mut)')}></span>
                {t.xgAgainst}
              </span>
            </div>
          </div>
          {vm.xgChart}
        </div>
        <div
          style={css(
            'background:linear-gradient(160deg,rgba(56,189,248,.07),var(--card) 60%);border:1px solid var(--bd);border-radius:14px;padding:18px 19px;position:relative',
          )}
        >
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:14px')}>
            <span
              style={css(
                'display:flex;align-items:center;gap:6px;background:var(--aid);color:var(--ai);font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px',
              )}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10l6-1.6Z" />
              </svg>
              {t.aiGenerated}
            </span>
            <span style={css('margin-inline-start:auto;font-size:11px;font-weight:700;color:var(--sub)')}>
              {t.confidence} <b style={css('color:var(--ai)')}>۹۲٪</b>
            </span>
          </div>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:12px')}>{t.aiInsights}</div>
          <div style={css('display:flex;flex-direction:column;gap:11px')}>
            {vm.insights.map((ins: any) => (
              <div key={ins.id} style={css('display:flex;gap:9px;align-items:flex-start')}>
                <span
                  style={css(
                    'width:6px;height:6px;border-radius:50%;background:var(--ai);margin-top:8px;flex-shrink:0',
                  )}
                ></span>
                <div style={css('flex:1')}>
                  <div style={css('font-size:12.5px;color:#cdd2d8;line-height:1.65')}>{ins.text}</div>
                  <button
                    onClick={ins.onWhy}
                    style={css(
                      'margin-top:5px;display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--ai);padding:0',
                    )}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3M12 17h.01" strokeLinecap="round" />
                    </svg>
                    {ins.whyLabel}
                  </button>
                  {ins.open ? (
                    <div
                      style={css(
                        'margin-top:8px;padding:10px 12px;background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.18);border-radius:9px;font-size:11.5px;color:#aeb6bf;line-height:1.7',
                      )}
                    >
                      {ins.explain}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div style={css('display:flex;gap:8px;margin-top:16px')}>
            <button
              style={css(
                'flex:1;height:34px;background:var(--acd);border:1px solid rgba(163,230,53,.35);border-radius:9px;color:var(--ac);font-family:inherit;font-weight:700;font-size:12.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px',
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m20 6-11 11-5-5" />
              </svg>
              {t.approve}
            </button>
            <button
              style={css(
                'flex:1;height:34px;background:transparent;border:1px solid var(--bd2);border-radius:9px;color:var(--sub);font-family:inherit;font-weight:700;font-size:12.5px;cursor:pointer',
              )}
            >
              {t.correct}
            </button>
          </div>
        </div>
      </div>

      <div style={css('display:grid;grid-template-columns:1fr 1.4fr;gap:14px')}>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px 19px')}
        >
          <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{t.teamForm}</div>
          <div style={css('display:flex;flex-direction:column;gap:13px')}>
            {vm.formMetrics.map((m: any, i: number) => (
              <div key={i}>
                <div
                  style={css('display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px')}
                >
                  <span style={css('color:var(--sub)')}>{m.label}</span>
                  <span style={css('font-weight:700')}>{m.val}</span>
                </div>
                <div
                  style={css('height:6px;background:var(--raised);border-radius:6px;overflow:hidden')}
                >
                  <div
                    style={css(`height:100%;width:${m.pct};background:${m.color};border-radius:6px`)}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px 19px')}
        >
          <div
            style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:12px')}
          >
            <div style={css('font-weight:700;font-size:14px')}>{t.recentSessions}</div>
            <button
              onClick={v.goLibrary}
              style={css(
                'font-size:12px;color:var(--ac);background:none;border:none;cursor:pointer;font-family:inherit;font-weight:600',
              )}
            >
              {t.viewAll} →
            </button>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            {vm.sessions.map((s: any, i: number) => (
              <Box
                key={i}
                css="display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;background:var(--bg2);border:1px solid transparent;cursor:pointer"
                hover="border-color:var(--bd)"
              >
                <div
                  style={css(
                    'width:42px;height:42px;border-radius:9px;background:var(--raised);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative',
                  )}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={s.iconColor}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div style={css('flex:1;min-width:0')}>
                  <div
                    style={css(
                      'font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                    )}
                  >
                    {s.title}
                  </div>
                  <div style={css('font-size:11px;color:var(--mut)')}>
                    {s.date} · {s.dur}
                  </div>
                </div>
                <span
                  style={css(
                    `font-size:10.5px;font-weight:700;color:${s.statusColor};background:${s.statusBg};padding:3px 9px;border-radius:20px;white-space:nowrap`,
                  )}
                >
                  {s.status}
                </span>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
