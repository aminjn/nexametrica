import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { ManualList } from '../components/ManualList'

// Ported from prototype lines 1649–1765. Top block is REAL — a persistent training plan.
export function Training({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  return (
    <div style={css('max-width:1340px;margin:0 auto')}>
      <ManualList
        v={v}
        collection="training"
        title={L('برنامه‌ی تمرینی', 'Training plan')}
        hint={L('جلسات را وارد کن — ذخیره می‌ماند', 'enter sessions — persists')}
        fields={[
          { key: 'date', ph: L('تاریخ', 'Date'), type: 'date', width: '150px' },
          { key: 'focus', ph: L('تمرکز (مثلاً فاز دفاعی)', 'Focus (e.g. defending)') },
          { key: 'drill', ph: L('تمرین', 'Drill') },
          { key: 'load', ph: L('بار', 'Load'), type: 'select', width: '120px', options: [['low', L('کم', 'Low')], ['med', L('متوسط', 'Medium')], ['high', L('زیاد', 'High')]] },
        ]}
      />
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
      </div>
      <div
        style={css(
          'background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:18px 20px;margin-bottom:16px',
        )}
      >
        <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:14px')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 12h18M12 3v18" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          <div style={css('font-size:13px;font-weight:700')}>{vm.team.boardTitle}</div>
          <span style={css('font-size:11px;color:var(--mut)')}>· {vm.team.name}</span>
          <div style={css('flex:1')}></div>
          {vm.team.canEdit ? (
            <div style={css('display:flex;gap:8px')}>
              <button
                onClick={vm.team.editS}
                style={css(
                  'height:32px;padding:0 13px;background:var(--card2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer',
                )}
              >
                {vm.team.editLabel}
              </button>
              <button
                onClick={vm.team.addS}
                style={css(
                  'height:32px;padding:0 13px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-size:11.5px;font-weight:800;cursor:pointer',
                )}
              >
                {vm.team.addLabel}
              </button>
            </div>
          ) : null}
          {vm.team.lockNote ? (
            <span style={css('font-size:11px;color:var(--mut)')}>{vm.team.lockNote}</span>
          ) : null}
        </div>
        <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px')}>
          {vm.team.list.map((s: any, i: number) => (
            <button
              key={i}
              onClick={s.onSel}
              style={css(
                `height:32px;padding:0 14px;background:${s.bg};border:1px solid ${s.bd};border-radius:20px;color:${s.fg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`,
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
        {vm.team.dragHint ? (
          <div
            style={css(
              'display:flex;align-items:center;gap:6px;font-size:11px;color:var(--ai);margin-bottom:11px',
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
            </svg>
            <span>{vm.team.dragHint}</span>
          </div>
        ) : null}
        <div style={css('display:grid;grid-template-columns:1.5fr 1fr;gap:18px')}>
          <div
            style={css(
              'position:relative;aspect-ratio:1.55;background:linear-gradient(180deg,#1b6b3a,#15532e);border:2px solid rgba(255,255,255,.22);border-radius:10px;overflow:hidden',
            )}
          >
            <div
              style={css(
                'position:absolute;inset:0;background-image:repeating-linear-gradient(90deg,transparent 0,transparent 9.5%,rgba(255,255,255,.05) 9.5%,rgba(255,255,255,.05) 10%)',
              )}
            ></div>
            <div
              style={css('position:absolute;top:0;bottom:0;left:50%;width:2px;background:rgba(255,255,255,.25)')}
            ></div>
            <div
              style={css(
                'position:absolute;top:50%;left:50%;width:18%;aspect-ratio:1;transform:translate(-50%,-50%);border:2px solid rgba(255,255,255,.25);border-radius:50%',
              )}
            ></div>
            <div
              style={css(
                'position:absolute;top:32%;bottom:32%;left:0;width:14%;border:2px solid rgba(255,255,255,.2);border-inline-start:none',
              )}
            ></div>
            <div
              style={css(
                'position:absolute;top:32%;bottom:32%;right:0;width:14%;border:2px solid rgba(255,255,255,.2);border-inline-end:none',
              )}
            ></div>
            {vm.team.stations.map((st: any, i: number) => (
              <div
                key={i}
                onPointerDown={st.onDown}
                style={css(
                  `position:absolute;left:${st.left};top:${st.top};transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:4px;cursor:${st.cursor};touch-action:none;user-select:none`,
                )}
              >
                <div
                  style={css(
                    `width:30px;height:30px;border-radius:50%;background:${st.c};border:2px solid rgba(255,255,255,.85);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#0d0f12;box-shadow:0 2px 8px rgba(0,0,0,.4)`,
                  )}
                >
                  {st.l}
                </div>
                <div
                  style={css(
                    'font-size:9.5px;font-weight:700;color:#fff;background:rgba(0,0,0,.55);padding:2px 7px;border-radius:20px;white-space:nowrap;max-width:130px;overflow:hidden;text-overflow:ellipsis',
                  )}
                >
                  {st.d}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px')}>
              <div
                style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:11px;padding:12px 14px')}
              >
                <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:5px')}>{vm.team.intLabel}</div>
                <div style={css(`font-size:18px;font-weight:800;color:${vm.team.intC};margin-bottom:7px`)}>
                  {vm.team.intensity}
                </div>
                <div style={css('height:5px;background:var(--raised);border-radius:5px;overflow:hidden')}>
                  <div style={css(`height:100%;width:${vm.team.intW};background:${vm.team.intC};border-radius:5px`)}></div>
                </div>
              </div>
              <div
                style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:11px;padding:12px 14px')}
              >
                <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:5px')}>{vm.team.durLabel}</div>
                <div style={css('font-size:18px;font-weight:800')}>{vm.team.dur}</div>
              </div>
            </div>
            <div
              style={css(
                'background:var(--bg2);border:1px solid var(--bd);border-radius:11px;padding:12px 14px;margin-bottom:14px',
              )}
            >
              <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:5px')}>{vm.team.focusLabel}</div>
              <div style={css('font-size:13px;font-weight:600;line-height:1.6')}>{vm.team.focus}</div>
            </div>
            <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:9px')}>{vm.team.stationsLabel}</div>
            <div style={css('display:flex;flex-direction:column;gap:7px')}>
              {vm.team.stations.map((st: any, i: number) => (
                <div key={i} style={css('display:flex;align-items:center;gap:10px')}>
                  <div
                    style={css(
                      `width:22px;height:22px;border-radius:50%;background:${st.c};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#0d0f12;flex-shrink:0`,
                    )}
                  >
                    {st.l}
                  </div>
                  <div style={css('font-size:12px;color:var(--sub)')}>{st.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          style={css(
            'display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;padding-top:13px;border-top:1px solid var(--bd)',
          )}
        >
          {vm.team.legend.map((lg: any, i: number) => (
            <div key={i} style={css('display:flex;align-items:center;gap:6px')}>
              <span style={css(`width:10px;height:10px;border-radius:50%;background:${lg.c}`)}></span>
              <span style={css('font-size:11px;color:var(--sub)')}>{lg.l}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={css(
          'background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:18px 20px;margin-bottom:16px',
        )}
      >
        <div style={css('font-size:13px;font-weight:700;margin-bottom:14px')}>{t.microcycle}</div>
        <div style={css('display:grid;grid-template-columns:repeat(6,1fr);gap:12px')}>
          {vm.week.map((d: any, i: number) => (
            <div
              key={i}
              style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:12px;text-align:center')}
            >
              <div style={css(`font-size:10px;font-weight:800;color:${d.c};margin-bottom:2px`)}>{d.tag}</div>
              <div style={css('font-size:12px;font-weight:600;margin-bottom:10px')}>{d.day}</div>
              <div
                style={css('height:64px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:9px')}
              >
                <div style={css(`width:22px;height:${d.h};background:${d.c};border-radius:5px`)}></div>
              </div>
              <div style={css('font-size:11px;color:var(--sub)')}>{d.type}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--ai)">
          <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
        </svg>
        <span style={css('font-size:13px;font-weight:700')}>{t.perPlayerPlan}</span>
        <span
          style={css(
            'font-size:11px;color:var(--ai);background:var(--aid);padding:2px 9px;border-radius:20px;font-weight:700',
          )}
        >
          {t.confidence} {vm.conf}٪
        </span>
      </div>
      <div style={css('display:flex;flex-direction:column;gap:10px;margin-bottom:16px')}>
        {vm.focus.map((p: any, i: number) => (
          <div
            key={i}
            style={css(
              'background:var(--card);border:1px solid var(--bd);border-radius:13px;padding:13px 16px;display:flex;align-items:center;gap:16px',
            )}
          >
            <div style={css('min-width:130px')}>
              <div style={css('font-size:13.5px;font-weight:700')}>{p.n}</div>
              <div style={css('font-size:11px;color:var(--mut);margin-top:2px')}>{p.pos}</div>
            </div>
            <div style={css('width:1px;height:30px;background:var(--bd)')}></div>
            <div style={css('min-width:120px')}>
              <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:3px')}>{t.focusArea}</div>
              <div style={css('font-size:12.5px;font-weight:700;color:var(--ai)')}>{p.area}</div>
            </div>
            <div style={css('flex:1')}>
              <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:3px')}>{t.recommendedDrill}</div>
              <div style={css('font-size:12.5px')}>{p.drill}</div>
            </div>
            <div style={css('text-align:center;min-width:90px')}>
              <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:5px')}>{t.load}</div>
              <div style={css('height:6px;width:80px;background:var(--raised);border-radius:6px;overflow:hidden')}>
                <div style={css(`height:100%;width:${p.loadPct};background:${p.loadC};border-radius:6px`)}></div>
              </div>
            </div>
            <span
              style={css(
                `font-size:11px;font-weight:700;color:${p.riskC};background:rgba(255,255,255,.05);padding:4px 11px;border-radius:20px;white-space:nowrap`,
              )}
            >
              {p.riskL}
            </span>
          </div>
        ))}
      </div>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 17px')}>
        <div style={css('font-size:13px;color:#cdd2d8;line-height:1.8')}>{vm.why.text}</div>
        <button
          onClick={vm.why.onWhy}
          style={css(
            'margin-top:9px;display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--ai)',
          )}
        >
          {vm.why.whyLabel}
        </button>
        {vm.why.open ? (
          <div
            style={css(
              'margin-top:8px;padding:11px 13px;background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.18);border-radius:9px;font-size:12px;color:#aeb6bf;line-height:1.7',
            )}
          >
            {vm.why.explain}
          </div>
        ) : null}
      </div>
    </div>
  )
}
