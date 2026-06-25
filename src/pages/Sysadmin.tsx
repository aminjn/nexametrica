import { Fragment } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import { AdminAiConfig } from '../components/AdminAiConfig'
import type { PageProps } from './types'

// Ported from prototype lines 1235–1419. vm = v.vm (engine.vm_sysadmin()).
export function Sysadmin({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div
      style={css(
        'max-width:1320px;margin:0 auto;display:grid;grid-template-columns:212px 1fr;gap:16px',
      )}
    >
      <div
        style={css(
          'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:8px;height:fit-content',
        )}
      >
        <div style={css('display:flex;align-items:center;gap:9px;padding:10px 11px 12px')}>
          <span
            style={css(
              'width:30px;height:30px;border-radius:9px;background:rgba(244,63,94,.14);display:flex;align-items:center;justify-content:center',
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.9">
              <path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" />
            </svg>
          </span>
          <div style={css('font-size:12.5px;font-weight:800;color:#f43f5e')}>{t.saOverview}</div>
        </div>
        {vm.tabs.map((tb: any, i: number) => (
          <Box
            key={i}
            as="button"
            onClick={tb.set}
            css={`width:100%;display:flex;align-items:center;gap:10px;padding:9px 11px;margin-bottom:2px;border:none;border-radius:9px;background:${tb.bg};color:${tb.fg};font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer;text-align:start`}
            hover="background:var(--bg2)"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={css('flex-shrink:0')}
            >
              <path d={tb.ic} />
            </svg>
            {tb.label}
          </Box>
        ))}
      </div>
      <div>
        {vm.sy_overview ? (
          <>
            <div
              style={css(
                'display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:14px',
              )}
            >
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px',
                )}
              >
                <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>
                  {t.activeClubs}
                </div>
                <div style={css('font-size:24px;font-weight:800')}>۲۴</div>
              </div>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px',
                )}
              >
                <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>
                  {t.totalUsers}
                </div>
                <div style={css('font-size:24px;font-weight:800')}>۳۴۸</div>
              </div>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px',
                )}
              >
                <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>
                  {t.gamesProcessed}
                </div>
                <div style={css('font-size:24px;font-weight:800;color:var(--ac)')}>۱۲٬۴۸۰</div>
              </div>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:15px 16px',
                )}
              >
                <div style={css('font-size:11px;color:var(--sub);margin-bottom:8px')}>
                  {t.apiToday}
                </div>
                <div style={css('font-size:24px;font-weight:800;color:#f43f5e')}>۱٬۷۱۰</div>
              </div>
            </div>
            <div
              style={css(
                'display:grid;grid-template-columns:1.6fr 1fr;gap:14px;margin-bottom:14px',
              )}
            >
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
                )}
              >
                <div
                  style={css(
                    'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px',
                  )}
                >
                  <div style={css('font-weight:700;font-size:14px')}>{t.apiToday}</div>
                  <span style={css('font-size:11px;color:var(--mut)')}>۱۴ {t.matches}</span>
                </div>
                {vm.apiUsage}
              </div>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
                )}
              >
                <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>
                  {t.systemHealth}
                </div>
                <div style={css('display:flex;flex-direction:column;gap:13px')}>
                  <div style={css('display:flex;align-items:center;justify-content:space-between')}>
                    <span style={css('font-size:12.5px;color:var(--sub)')}>{t.apiStatus}</span>
                    <span
                      style={css(
                        'display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;color:var(--good)',
                      )}
                    >
                      <span
                        style={css(
                          'width:7px;height:7px;border-radius:50%;background:var(--good);box-shadow:0 0 8px var(--good)',
                        )}
                      ></span>
                      {t.operational}
                    </span>
                  </div>
                  <div style={css('display:flex;align-items:center;justify-content:space-between')}>
                    <span style={css('font-size:12.5px;color:var(--sub)')}>{t.uptime}</span>
                    <span style={css('font-size:13px;font-weight:800;font-family:monospace')}>
                      ۹۹٫۹۸٪
                    </span>
                  </div>
                  <div style={css('display:flex;align-items:center;justify-content:space-between')}>
                    <span style={css('font-size:12.5px;color:var(--sub)')}>صف پردازش</span>
                    <span style={css('font-size:13px;font-weight:700;color:var(--ai)')}>
                      ۳ {t.matches}
                    </span>
                  </div>
                  <div style={css('height:1px;background:var(--bd)')}></div>
                  <div style={css('display:flex;align-items:center;justify-content:space-between')}>
                    <span style={css('font-size:12.5px;color:var(--sub)')}>دیتابیس</span>
                    <span
                      style={css(
                        'display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;color:var(--good)',
                      )}
                    >
                      <span
                        style={css('width:7px;height:7px;border-radius:50%;background:var(--good)')}
                      ></span>
                      {t.operational}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
              )}
            >
              <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>
                {t.recentEvents}
              </div>
              <div style={css('display:flex;flex-direction:column;gap:8px')}>
                {vm.sysEvents.map((e: any, i: number) => (
                  <div
                    key={i}
                    style={css(
                      'display:flex;align-items:center;gap:12px;padding:11px 13px;background:var(--bg2);border-radius:10px',
                    )}
                  >
                    <span
                      style={css(
                        `width:8px;height:8px;border-radius:50%;background:${e.c};flex-shrink:0`,
                      )}
                    ></span>
                    <div style={css('flex:1;font-size:12.5px;font-weight:500')}>{e.a}</div>
                    <span style={css('font-size:11px;color:var(--mut)')}>{e.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {vm.sy_aiapi ? (
          <>
          <AdminAiConfig v={v} />
          {false && (
          <div style={css('display:grid;grid-template-columns:1.3fr 1fr;gap:14px')}>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px',
              )}
            >
              <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:6px')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ai)">
                  <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                </svg>
                <div style={css('font-weight:700;font-size:15px')}>{t.modelsTitle}</div>
              </div>
              <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:16px')}>
                {t.saAiApi} · {t.sharedKey}:{' '}
                <span style={css('font-family:monospace;color:var(--sub)')}>sk-nexa-•••4f2a</span>
              </div>
              <div style={css('display:flex;flex-direction:column;gap:12px')}>
                {vm.aiModels.map((m: any, i: number) => (
                  <div
                    key={i}
                    style={css(
                      'background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:14px 15px',
                    )}
                  >
                    <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:12px')}>
                      <div
                        style={css(
                          `width:32px;height:32px;border-radius:9px;background:${m.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0`,
                        )}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={m.c}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={m.icon} />
                        </svg>
                      </div>
                      <div style={css('flex:1;min-width:0')}>
                        <div style={css('font-size:13px;font-weight:700')}>{m.tag}</div>
                        <div
                          style={css(
                            'font-size:10.5px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                          )}
                        >
                          {m.use}
                        </div>
                      </div>
                      <span
                        style={css(
                          `display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;color:${m.stc}`,
                        )}
                      >
                        <span
                          style={css(`width:7px;height:7px;border-radius:50%;background:${m.stc}`)}
                        ></span>
                        {m.stLabel}
                      </span>
                    </div>
                    <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:8px')}>
                      <div
                        style={css(
                          'height:34px;background:var(--card);border:1px solid var(--bd);border-radius:8px;display:flex;align-items:center;justify-content:space-between;padding:0 11px;font-size:11.5px;font-weight:600',
                        )}
                      >
                        {m.prov}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--mut)" strokeWidth="2">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                      <div
                        style={css(
                          'height:34px;background:var(--card);border:1px solid var(--bd);border-radius:8px;display:flex;align-items:center;justify-content:space-between;padding:0 11px;font-size:11px;font-family:monospace;color:var(--sub)',
                        )}
                      >
                        {m.model}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--mut)" strokeWidth="2">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <div style={css('display:flex;align-items:center;gap:9px;margin-top:8px')}>
                      <div
                        style={css(
                          'flex:1;height:32px;background:var(--card);border:1px solid var(--bd);border-radius:8px;display:flex;align-items:center;padding:0 11px;font-family:monospace;font-size:10.5px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                        )}
                      >
                        {m.ep}
                      </div>
                      <button
                        onClick={m.test}
                        style={css(
                          `height:32px;padding:0 13px;background:${m.testBg};border:1px solid var(--bd2);border-radius:8px;color:${m.testFg};font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;flex-shrink:0`,
                        )}
                      >
                        {m.testLabel}
                      </button>
                    </div>
                  </div>
                ))}
                <div style={css('display:flex;gap:10px;margin-top:2px')}>
                  <button
                    onClick={vm.addAiModel}
                    style={css(
                      'height:40px;padding:0 16px;background:var(--card2);border:1px dashed var(--bd2);border-radius:10px;color:var(--sub);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer',
                    )}
                  >
                    {t.addModel}
                  </button>
                  <div style={css('flex:1')}></div>
                  <button
                    style={css(
                      'height:40px;padding:0 18px;background:#f43f5e;border:none;border-radius:10px;color:#fff;font-family:inherit;font-size:12.5px;font-weight:800;cursor:pointer',
                    )}
                  >
                    {t.save}
                  </button>
                </div>
              </div>
            </div>
            <div style={css('display:flex;flex-direction:column;gap:14px')}>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
                )}
              >
                <div
                  style={css(
                    'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px',
                  )}
                >
                  <div style={css('font-weight:700;font-size:13.5px')}>{t.usageTokens}</div>
                  <span style={css('font-size:13px;font-weight:800;color:var(--ai)')}>۸٫۱M</span>
                </div>
                {vm.tokenUse}
              </div>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
                )}
              >
                <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
                  {t.monthlyCost}
                </div>
                <div style={css('font-size:24px;font-weight:800')}>۱۸�۴ $</div>
                <div style={css('font-size:11px;color:var(--mut);margin-top:6px')}>
                  ۶۲٪ از سقف ماهانه
                </div>
                <div
                  style={css(
                    'height:6px;background:var(--raised);border-radius:6px;margin-top:9px;overflow:hidden',
                  )}
                >
                  <div
                    style={css('width:62%;height:100%;background:var(--warn);border-radius:6px')}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          )}
          </>
        ) : null}

        {vm.sy_ml ? (
          <>
            <div
              style={css(
                'display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-bottom:14px',
              )}
            >
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px',
                )}
              >
                <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
                  {t.modelVersion}
                </div>
                <div style={css('font-size:20px;font-weight:800;font-family:monospace')}>
                  v۴٫۲٫۱
                </div>
              </div>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px',
                )}
              >
                <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
                  {t.lastTrained}
                </div>
                <div style={css('font-size:16px;font-weight:700')}>۱۲ دقیقه پیش</div>
              </div>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px',
                )}
              >
                <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
                  {t.datasetSize}
                </div>
                <div style={css('font-size:20px;font-weight:800')}>
                  ۱۲٬۴۸۰{' '}
                  <span style={css('font-size:12px;color:var(--mut);font-weight:600')}>
                    {t.matches}
                  </span>
                </div>
              </div>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px',
              )}
            >
              <div
                style={css(
                  'display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px',
                )}
              >
                <div style={css('flex:1;min-width:200px')}>
                  <div style={css('font-weight:700;font-size:15px;margin-bottom:4px')}>
                    {t.retrain}
                  </div>
                  <div style={css('font-size:12px;color:var(--sub);line-height:1.6')}>
                    آموزش مدل با تمام اصلاحات کاربران از آخرین اجرا. دقت فعلی: ۹۶٪
                  </div>
                </div>
                <button
                  style={css(
                    'height:42px;padding:0 22px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:9px',
                  )}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d0f12" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
                  </svg>
                  {t.retrain}
                </button>
              </div>
              <div
                style={css(
                  'display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--bg2);border-radius:11px;margin-bottom:10px',
                )}
              >
                <div>
                  <div style={css('font-size:13px;font-weight:600')}>{t.autoRetrain}</div>
                  <div style={css('font-size:11px;color:var(--mut);margin-top:2px')}>
                    هر یکشنبه ساعت ۰۳:۰۰
                  </div>
                </div>
                <span
                  style={css(
                    'display:inline-block;width:38px;height:21px;border-radius:20px;background:var(--acd);position:relative;cursor:pointer',
                  )}
                >
                  <span
                    style={css(
                      'position:absolute;inset-inline-end:2px;top:2px;width:17px;height:17px;border-radius:50%;background:var(--ac)',
                    )}
                  ></span>
                </span>
              </div>
              <div
                style={css(
                  'display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--bg2);border-radius:11px',
                )}
              >
                <div style={css('font-size:13px;font-weight:600')}>{t.trainSchedule}</div>
                <span style={css('font-size:12.5px;font-weight:700;color:var(--sub)')}>
                  هفتگی ▾
                </span>
              </div>
            </div>
          </>
        ) : null}

        {vm.sy_sms ? (
          <>
            <div
              style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px')}
            >
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px',
                )}
              >
                <div style={css('font-weight:700;font-size:15px;margin-bottom:16px')}>
                  IPPanel · {t.saSms}
                </div>
                <div style={css('display:flex;flex-direction:column;gap:14px')}>
                  <div>
                    <div
                      style={css(
                        'font-size:11.5px;color:var(--sub);margin-bottom:7px;font-weight:600',
                      )}
                    >
                      {t.ippanelKey}
                    </div>
                    <div
                      style={css(
                        'height:40px;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;display:flex;align-items:center;padding:0 13px;font-family:monospace;font-size:12px;color:var(--sub)',
                      )}
                    >
                      ippanel-•••••••••••2b7c
                    </div>
                  </div>
                  <div>
                    <div
                      style={css(
                        'font-size:11.5px;color:var(--sub);margin-bottom:7px;font-weight:600',
                      )}
                    >
                      {t.sendLine}
                    </div>
                    <div
                      style={css(
                        'height:40px;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;display:flex;align-items:center;padding:0 13px;font-family:monospace;font-size:12.5px',
                      )}
                    >
                      ۳۰۰۰۵۰۵۰۵۰
                    </div>
                  </div>
                  <button
                    style={css(
                      'height:40px;background:var(--card2);border:1px solid var(--bd2);border-radius:10px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer',
                    )}
                  >
                    {t.testSms}
                  </button>
                </div>
              </div>
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px',
                )}
              >
                <div style={css('font-weight:700;font-size:15px;margin-bottom:16px')}>
                  {t.otpLogin}
                </div>
                <div style={css('display:flex;flex-direction:column;gap:16px')}>
                  <div>
                    <div
                      style={css(
                        'font-size:11.5px;color:var(--sub);margin-bottom:8px;font-weight:600',
                      )}
                    >
                      {t.otpLen}
                    </div>
                    <div
                      style={css(
                        'display:flex;gap:5px;background:var(--bg2);border-radius:9px;padding:3px;width:fit-content',
                      )}
                    >
                      <button
                        style={css(
                          'padding:7px 16px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
                        )}
                      >
                        ۴
                      </button>
                      <button
                        style={css(
                          'padding:7px 16px;border:none;border-radius:7px;background:var(--ac);color:#0d0f12;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
                        )}
                      >
                        ۵
                      </button>
                      <button
                        style={css(
                          'padding:7px 16px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
                        )}
                      >
                        ۶
                      </button>
                    </div>
                  </div>
                  <div>
                    <div
                      style={css(
                        'font-size:11.5px;color:var(--sub);margin-bottom:8px;font-weight:600',
                      )}
                    >
                      {t.otpValid}
                    </div>
                    <div
                      style={css(
                        'height:40px;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;display:flex;align-items:center;gap:10px;padding:0 13px',
                      )}
                    >
                      <div
                        style={css(
                          'flex:1;height:5px;background:var(--raised);border-radius:6px;position:relative',
                        )}
                      >
                        <div
                          style={css('width:40%;height:100%;background:var(--ac);border-radius:6px')}
                        ></div>
                        <div
                          style={css(
                            'position:absolute;inset-inline-start:40%;top:50%;transform:translate(-50%,-50%);width:12px;height:12px;border-radius:50%;background:var(--ac)',
                          )}
                        ></div>
                      </div>
                      <span style={css('font-family:monospace;font-size:12px;font-weight:700')}>
                        ۲ دقیقه
                      </span>
                    </div>
                  </div>
                  <div>
                    <div
                      style={css(
                        'font-size:11.5px;color:var(--sub);margin-bottom:7px;font-weight:600',
                      )}
                    >
                      {t.otpTemplate}
                    </div>
                    <div
                      style={css(
                        'background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:11px 13px;font-size:12px;color:var(--sub);line-height:1.7',
                      )}
                    >
                      کد ورود شما به نکسا متریکا: %code%<br />
                      این کد تا ۲ دقیقه معتبر است.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
              )}
            >
              <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{t.smsLog}</div>
              <div
                style={css(
                  'display:flex;font-size:11px;color:var(--mut);font-weight:700;padding:0 12px 10px',
                )}
              >
                <span style={css('width:130px')}>{t.recipient}</span>
                <span style={css('flex:1')}>متن</span>
                <span style={css('width:90px;text-align:center')}>{t.statusW}</span>
                <span style={css('width:60px;text-align:center')}>{t.timeW}</span>
              </div>
              <div style={css('display:flex;flex-direction:column;gap:6px')}>
                {vm.smsLog.map((s: any, i: number) => (
                  <div
                    key={i}
                    style={css(
                      'display:flex;align-items:center;font-size:12.5px;padding:10px 12px;background:var(--bg2);border-radius:9px',
                    )}
                  >
                    <span style={css('width:130px;font-family:monospace;color:var(--sub)')}>
                      {s.to}
                    </span>
                    <span style={css('flex:1')}>{s.txt}</span>
                    <span style={css('width:90px;text-align:center')}>
                      <span
                        style={css(
                          `font-size:10.5px;font-weight:700;color:${s.sc};background:${s.sb};padding:2px 9px;border-radius:20px`,
                        )}
                      >
                        {s.stLabel}
                      </span>
                    </span>
                    <span
                      style={css(
                        'width:60px;text-align:center;font-family:monospace;color:var(--mut)',
                      )}
                    >
                      {s.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {vm.sy_billing ? (
          <>
            <div
              style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px')}
            >
              <div
                style={css(
                  'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
                )}
              >
                <div
                  style={css(
                    'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px',
                  )}
                >
                  <div style={css('font-weight:700;font-size:14px')}>{t.revenue}</div>
                  <span style={css('font-size:15px;font-weight:800;color:var(--good)')}>
                    ۱۰۲M ﷼
                  </span>
                </div>
                {vm.revenue}
              </div>
              <div
                style={css(
                  'background:linear-gradient(150deg,rgba(163,230,53,.08),var(--card) 55%);border:1px solid var(--bd);border-radius:14px;padding:18px;display:flex;flex-direction:column;justify-content:center',
                )}
              >
                <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
                  {t.creditPool}
                </div>
                <div style={css('font-size:30px;font-weight:800;color:var(--ac)')}>
                  ۱۵٬۱۸۰{' '}
                  <span style={css('font-size:13px;color:var(--mut);font-weight:600')}>
                    {t.matches}
                  </span>
                </div>
                <div style={css('font-size:12px;color:var(--mut);margin-top:8px')}>
                  توزیع‌شده بین ۲۴ باشگاه
                </div>
              </div>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;overflow:hidden',
              )}
            >
              <div
                style={css(
                  'display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--bd)',
                )}
              >
                <div style={css('font-weight:700;font-size:14px')}>{t.subscriptions}</div>
              </div>
              <div
                style={css(
                  'display:flex;font-size:11px;color:var(--mut);font-weight:700;padding:11px 18px;background:var(--bg2)',
                )}
              >
                <span style={css('flex:1')}>{t.clubName}</span>
                <span style={css('width:100px')}>{t.plan}</span>
                <span style={css('width:90px;text-align:center')}>اعتبار</span>
                <span style={css('width:100px;text-align:center')}>{t.nextBill}</span>
                <span style={css('width:120px;text-align:end')}>مبلغ (﷼)</span>
              </div>
              {vm.subs.map((s: any, i: number) => (
                <div
                  key={i}
                  style={css(
                    'display:flex;align-items:center;font-size:12.5px;padding:13px 18px;border-bottom:1px solid var(--bd)',
                  )}
                >
                  <span style={css('flex:1;font-weight:600')}>{s.c}</span>
                  <span style={css('width:100px')}>
                    <span
                      style={css(
                        `font-size:11px;font-weight:700;color:${s.pc};background:rgba(255,255,255,.05);padding:3px 10px;border-radius:20px`,
                      )}
                    >
                      {s.plan}
                    </span>
                  </span>
                  <span style={css('width:90px;text-align:center;font-family:monospace')}>
                    {s.credit}
                  </span>
                  <span
                    style={css(
                      'width:100px;text-align:center;font-family:monospace;color:var(--sub)',
                    )}
                  >
                    {s.next}
                  </span>
                  <span
                    style={css(
                      'width:120px;text-align:end;font-family:monospace;font-weight:700',
                    )}
                  >
                    {s.amt}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {vm.sy_logs ? (
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
              )}
            >
              <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>
                {t.userActivity}
              </div>
              <div style={css('display:flex;flex-direction:column;gap:8px')}>
                {vm.userLog.map((u: any, i: number) => (
                  <div
                    key={i}
                    style={css(
                      'display:flex;align-items:center;gap:11px;padding:11px 13px;background:var(--bg2);border-radius:10px',
                    )}
                  >
                    <span
                      style={css(
                        'width:30px;height:30px;border-radius:50%;background:var(--raised);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--sub);flex-shrink:0',
                      )}
                    >
                      {u.ini}
                    </span>
                    <div style={css('flex:1;min-width:0')}>
                      <div style={css('font-size:12.5px;font-weight:600')}>{u.name}</div>
                      <div style={css('font-size:11px;color:var(--mut)')}>{u.a}</div>
                    </div>
                    <span style={css('font-size:10.5px;color:var(--mut);white-space:nowrap')}>
                      {u.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px',
              )}
            >
              <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>
                {t.systemLog}
              </div>
              <div style={css('display:flex;flex-direction:column;gap:7px')}>
                {vm.sysEvents.map((e: any, i: number) => (
                  <div
                    key={i}
                    style={css(
                      'display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--bg2);border-radius:9px;font-family:monospace',
                    )}
                  >
                    <span
                      style={css(
                        `font-size:9px;font-weight:800;color:${e.c};background:rgba(255,255,255,.05);padding:2px 7px;border-radius:5px;text-transform:uppercase;flex-shrink:0;margin-top:1px`,
                      )}
                    >
                      {e.lv}
                    </span>
                    <div
                      style={css(
                        "flex:1;font-size:11.5px;line-height:1.5;font-family:'Vazirmatn',sans-serif",
                      )}
                    >
                      {e.a}
                    </div>
                    <span style={css('font-size:10px;color:var(--mut);white-space:nowrap')}>
                      {e.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {vm.sy_general ? (
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px',
              )}
            >
              <div style={css('font-weight:700;font-size:15px;margin-bottom:16px')}>
                {t.saGeneral}
              </div>
              <div style={css('display:flex;flex-direction:column;gap:15px')}>
                <div>
                  <div
                    style={css('font-size:11.5px;color:var(--sub);margin-bottom:7px;font-weight:600')}
                  >
                    {t.platformName}
                  </div>
                  <div
                    style={css(
                      'height:40px;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;display:flex;align-items:center;padding:0 13px;font-size:13px;font-weight:600',
                    )}
                  >
                    نکسا متریکا
                  </div>
                </div>
                <div>
                  <div
                    style={css('font-size:11.5px;color:var(--sub);margin-bottom:7px;font-weight:600')}
                  >
                    {t.logoW}
                  </div>
                  <div style={css('display:flex;align-items:center;gap:12px')}>
                    <div
                      style={css(
                        'width:46px;height:46px;border-radius:11px;background:var(--ac);display:flex;align-items:center;justify-content:center',
                      )}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2 4 6v6c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V6l-8-4Z" fill="#0d0f12" />
                        <path d="M12 7v10M7.5 9.5l9 5M16.5 9.5l-9 5" stroke="#a3e635" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <button
                      style={css(
                        'height:36px;padding:0 15px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
                      )}
                    >
                      {t.uploadLogo}
                    </button>
                  </div>
                </div>
                <div>
                  <div
                    style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px;font-weight:600')}
                  >
                    {t.defaultLang}
                  </div>
                  <div
                    style={css(
                      'display:flex;gap:4px;background:var(--bg2);border-radius:9px;padding:3px;width:fit-content',
                    )}
                  >
                    <button
                      onClick={v.setFa}
                      style={css(
                        `padding:7px 16px;border:none;border-radius:7px;background:${v.faBtnBg};color:${v.faBtnFg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`,
                      )}
                    >
                      فارسی
                    </button>
                    <button
                      onClick={v.setEn}
                      style={css(
                        `padding:7px 16px;border:none;border-radius:7px;background:${v.enBtnBg};color:${v.enBtnFg};font-family:inherit;font-size:12px;font-weight:700;cursor:pointer`,
                      )}
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px',
              )}
            >
              <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:16px')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.9">
                  <path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" />
                </svg>
                <div style={css('font-weight:700;font-size:15px')}>{t.security}</div>
              </div>
              <div style={css('display:flex;flex-direction:column;gap:11px')}>
                <div
                  style={css(
                    'display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:var(--bg2);border-radius:11px',
                  )}
                >
                  <span style={css('font-size:13px;font-weight:600')}>{t.twoFA}</span>
                  <span
                    style={css(
                      'display:inline-block;width:38px;height:21px;border-radius:20px;background:rgba(244,63,94,.18);position:relative;cursor:pointer',
                    )}
                  >
                    <span
                      style={css(
                        'position:absolute;inset-inline-end:2px;top:2px;width:17px;height:17px;border-radius:50%;background:#f43f5e',
                      )}
                    ></span>
                  </span>
                </div>
                <div
                  style={css(
                    'display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:var(--bg2);border-radius:11px',
                  )}
                >
                  <span style={css('font-size:13px;font-weight:600')}>{t.sessionTimeout}</span>
                  <span style={css('font-size:12.5px;font-weight:700;color:var(--sub)')}>
                    ۳۰ ▾
                  </span>
                </div>
                <div
                  style={css(
                    'display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:var(--bg2);border-radius:11px',
                  )}
                >
                  <span style={css('font-size:13px;font-weight:600')}>{t.passwordPolicy}</span>
                  <span
                    style={css(
                      'font-size:11px;font-weight:700;color:var(--good);background:rgba(74,222,128,.13);padding:3px 11px;border-radius:20px',
                    )}
                  >
                    {t.strong}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
