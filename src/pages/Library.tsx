import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 242–339. vm = v.vm (engine.vm_library()).
export function Library({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <div style={css('display:grid;grid-template-columns:1.7fr 1fr;gap:14px;margin-bottom:16px')}>
        <div
          style={css(
            'border:1.5px dashed var(--bd2);border-radius:14px;padding:26px;display:flex;align-items:center;gap:20px;background:var(--card)',
          )}
        >
          <div
            style={css(
              'width:58px;height:58px;border-radius:14px;background:var(--acd);display:flex;align-items:center;justify-content:center;flex-shrink:0',
            )}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>
          <div style={css('flex:1')}>
            <div style={css('font-weight:700;font-size:15px;margin-bottom:4px')}>{t.dropTitle}</div>
            <div style={css('font-size:12.5px;color:var(--sub);line-height:1.6;margin-bottom:10px')}>
              {t.dropSub}
            </div>
            <div style={css('display:flex;flex-wrap:wrap;gap:6px')}>
              <span
                style={css(
                  'display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--sub);background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:4px 10px',
                )}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                </svg>
                {t.srcBroadcast}
              </span>
              <span
                style={css(
                  'display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--sub);background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:4px 10px',
                )}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M23 7l-7 5 7 5zM1 5h15v14H1z" />
                </svg>
                {t.srcTactical}
              </span>
              <span
                style={css(
                  'display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--ai);background:var(--aid);border:1px solid rgba(56,189,248,.25);border-radius:20px;padding:4px 10px',
                )}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 5l4 4M19 5l-4 4M5 19l4-4M19 19l-4-4M9 9h6v6H9z" />
                </svg>
                {t.srcDrone}
              </span>
              <span
                style={css(
                  'display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--sub);background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:4px 10px',
                )}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="7" y="2" width="10" height="20" rx="2" />
                  <path d="M11 18h2" />
                </svg>
                {t.srcMobile}
              </span>
              <span
                style={css(
                  'display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--sub);background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:4px 10px',
                )}
              >
                <span
                  style={css(
                    'width:6px;height:6px;border-radius:50%;background:var(--good);animation:nx-pulse 1.5s infinite',
                  )}
                ></span>
                {t.srcLive}
              </span>
            </div>
          </div>
          <button
            style={css(
              'height:40px;padding:0 18px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer;flex-shrink:0',
            )}
          >
            {t.chooseFile}
          </button>
        </div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;justify-content:center;gap:12px',
          )}
        >
          <div style={css('display:flex;align-items:center;justify-content:space-between')}>
            <span style={css('font-size:12.5px;color:var(--sub)')}>{t.totalVideos}</span>
            <span style={css('font-weight:800;font-size:18px')}>۲۴۸</span>
          </div>
          <div style={css('height:1px;background:var(--bd)')}></div>
          <div style={css('display:flex;align-items:center;justify-content:space-between')}>
            <span style={css('font-size:12.5px;color:var(--sub)')}>{t.processing}</span>
            <span style={css('font-weight:800;font-size:18px;color:var(--ai)')}>۲</span>
          </div>
          <div style={css('height:1px;background:var(--bd)')}></div>
          <div style={css('display:flex;align-items:center;justify-content:space-between')}>
            <span style={css('font-size:12.5px;color:var(--sub)')}>{t.storage}</span>
            <span style={css('font-weight:700;font-size:13px;color:var(--mut)')}>۱٫۸ TB / ۵ TB</span>
          </div>
        </div>
      </div>
      <div
        style={css(
          'display:flex;align-items:center;gap:18px;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px;margin-bottom:16px',
        )}
      >
        <div
          style={css(
            'position:relative;width:120px;height:74px;border:1.5px solid var(--bd2);border-radius:6px;background:rgba(120,200,90,.04);flex-shrink:0',
          )}
        >
          <div
            style={css('position:absolute;top:0;bottom:0;left:50%;width:1px;background:var(--bd2)')}
          ></div>
          <div
            style={css(
              'position:absolute;top:50%;left:50%;width:20px;height:20px;border:1px solid var(--bd2);border-radius:50%;transform:translate(-50%,-50%)',
            )}
          ></div>
          <span
            style={css(
              'position:absolute;top:-5px;left:-5px;width:10px;height:10px;border-radius:50%;background:var(--ac);box-shadow:0 0 8px var(--ac)',
            )}
          ></span>
          <span
            style={css(
              'position:absolute;top:-5px;right:-5px;width:10px;height:10px;border-radius:50%;background:var(--ac);box-shadow:0 0 8px var(--ac)',
            )}
          ></span>
          <span
            style={css(
              'position:absolute;bottom:-5px;left:-5px;width:10px;height:10px;border-radius:50%;background:var(--ac);box-shadow:0 0 8px var(--ac)',
            )}
          ></span>
          <span
            style={css(
              'position:absolute;bottom:-5px;right:-5px;width:10px;height:10px;border-radius:50%;background:var(--ac);box-shadow:0 0 8px var(--ac)',
            )}
          ></span>
        </div>
        <div style={css('flex:1')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:4px')}>
            <div style={css('font-weight:700;font-size:14px')}>{t.pitchCalib}</div>
            <span
              style={css(
                'display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:var(--good);background:rgba(74,222,128,.13);padding:2px 8px;border-radius:20px',
              )}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="m20 6-11 11-5-5" />
              </svg>
              {t.calibrated}
            </span>
          </div>
          <div style={css('font-size:12px;color:var(--sub);line-height:1.6')}>{t.calibDesc}</div>
        </div>
        <button
          style={css(
            'height:36px;padding:0 16px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;flex-shrink:0',
          )}
        >
          {t.calibrate}
        </button>
      </div>
      <div
        style={css(
          'background:linear-gradient(150deg,rgba(56,189,248,.08),var(--card) 55%);border:1px solid rgba(56,189,248,.22);border-radius:14px;padding:18px 20px;margin-bottom:16px',
        )}
      >
        <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:18px')}>
          <span
            style={css(
              'position:relative;width:34px;height:34px;border-radius:10px;background:var(--aid);display:flex;align-items:center;justify-content:center',
            )}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="var(--ai)">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            <span
              style={css(
                'position:absolute;inset:0;border-radius:10px;border:1.5px solid var(--ai);animation:nx-pulse 1.6s infinite',
              )}
            ></span>
          </span>
          <div style={css('flex:1')}>
            <div style={css('font-weight:700;font-size:14px')}>{t.liveProcessing}</div>
            <div style={css('font-size:11.5px;color:var(--mut)')}>{vm.procVideo}</div>
          </div>
          <span
            style={css(
              'display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--ai);background:var(--aid);padding:5px 12px;border-radius:20px',
            )}
          >
            <span
              style={css(
                'width:6px;height:6px;border-radius:50%;background:var(--ai);animation:nx-pulse 1.4s infinite',
              )}
            ></span>
            {t.aiWorking}
          </span>
        </div>
        <div style={css('display:flex;align-items:flex-start')}>
          {vm.stages.map((st: any, i: number) => (
            <div
              key={i}
              style={css('flex:1;display:flex;flex-direction:column;align-items:center;position:relative')}
            >
              <div style={css('display:flex;align-items:center;width:100%')}>
                <div style={css('flex:1;height:2px;background:var(--bd)')}></div>
                <span
                  style={css(
                    `position:relative;width:26px;height:26px;border-radius:50%;background:${st.dot};display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1`,
                  )}
                >
                  <span
                    style={css(
                      `position:absolute;inset:-4px;border-radius:50%;border:1.5px solid ${st.ring};animation:nx-pulse 1.5s infinite`,
                    )}
                  ></span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0d0f12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m20 6-11 11-5-5" />
                  </svg>
                </span>
                <div style={css('flex:1;height:2px;background:var(--bd)')}></div>
              </div>
              <div
                style={css(`font-size:11.5px;font-weight:600;color:${st.txtC};margin-top:9px;text-align:center`)}
              >
                {st.label}
              </div>
              {st.pct ? (
                <div style={css('font-size:10.5px;color:var(--ai);font-weight:700;margin-top:3px')}>
                  {st.pct}٪
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap')}>
        <div
          style={css(
            'display:flex;gap:6px;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:4px',
          )}
        >
          <button
            style={css(
              'padding:6px 14px;border:none;border-radius:7px;background:var(--ac);color:#0d0f12;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
            )}
          >
            {t.all}
          </button>
          <button
            style={css(
              'padding:6px 14px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
            )}
          >
            {t.matchType}
          </button>
          <button
            style={css(
              'padding:6px 14px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
            )}
          >
            {t.trainingType}
          </button>
          <button
            style={css(
              'padding:6px 14px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
            )}
          >
            {t.scoutType}
          </button>
        </div>
        <div style={css('flex:1')}></div>
        <button
          style={css(
            'height:36px;padding:0 13px;background:var(--card);border:1px solid var(--bd);border-radius:9px;color:var(--sub);font-family:inherit;font-size:12.5px;cursor:pointer;display:flex;align-items:center;gap:7px',
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 6h18M7 12h10M11 18h2" />
          </svg>
          {t.filter}
        </button>
      </div>
      <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:16px')}>
        {vm.vids.map((v: any, i: number) => (
          <Box
            key={i}
            css="background:var(--card);border:1px solid var(--bd);border-radius:14px;overflow:hidden;cursor:pointer"
            hover="border-color:var(--bd2)"
          >
            <div
              style={css(
                'position:relative;aspect-ratio:16/9;background:repeating-linear-gradient(135deg,#1b1f26,#1b1f26 11px,#191d23 11px,#191d23 22px);display:flex;align-items:center;justify-content:center',
              )}
            >
              <div
                style={css(
                  'width:48px;height:48px;border-radius:50%;background:rgba(13,15,18,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.15)',
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span
                style={css(
                  'position:absolute;bottom:8px;inset-inline-end:8px;background:rgba(13,15,18,.8);color:#fff;font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:6px',
                )}
              >
                {v.dur}
              </span>
              <span
                style={css(
                  'position:absolute;top:8px;inset-inline-start:8px;background:rgba(13,15,18,.8);color:var(--sub);font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;display:flex;align-items:center;gap:4px',
                )}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="14" height="10" rx="2" />
                  <path d="m22 7-6 5 6 5z" />
                </svg>
                {v.ang}
              </span>
            </div>
            <div style={css('padding:13px 14px')}>
              <div
                style={css(
                  'font-weight:600;font-size:13px;line-height:1.5;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                )}
              >
                {v.title}
              </div>
              <div
                style={css(
                  'display:flex;align-items:center;gap:8px;font-size:11px;color:var(--mut);margin-bottom:11px',
                )}
              >
                <span>{v.type}</span>
                <span>·</span>
                <span>{v.date}</span>
              </div>
              <div style={css('display:flex;align-items:center;gap:8px')}>
                <span
                  style={css(
                    `font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px;color:${v.st.c};background:${v.st.b}`,
                  )}
                >
                  {v.stLabel}
                </span>
                {v.conf ? (
                  <span
                    style={css(
                      'margin-inline-start:auto;display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:var(--ai);background:var(--aid);padding:2px 7px;border-radius:20px',
                    )}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                    </svg>
                    {v.conf}٪
                  </span>
                ) : null}
              </div>
            </div>
          </Box>
        ))}
      </div>
    </div>
  )
}
