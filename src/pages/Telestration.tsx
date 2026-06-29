import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { TelestrationCanvas } from '../components/TelestrationCanvas'

// Ported from prototype lines 416–466. vm = v.vm (engine.vm_telestration()).
// Top block is REAL — draw arrows/lines on the latest analysed keyframe.
export function Telestration({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const frame: string | undefined = rr.calibration_check || rr.keyframe || (rr.keyframes && rr.keyframes[0])

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {frame ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('رسم روی فریمِ آنالیز', 'Draw on the analysed frame')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          <TelestrationCanvas src={frame} fa={fa} />
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز فریمِ آنالیزشده‌ای نیست. یک ویدیو آنالیز کن تا اینجا رویش رسم کنی. نمونه‌ی زیر دموی طراحی است.',
            'No analysed frame yet. Analyse a video to draw on it. The sample below is a design demo.')}
        </div>
      )}
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
      </div>
    <div
      style={css(
        'display:grid;grid-template-columns:auto 1fr;gap:16px',
      )}
    >
      <div
        style={css(
          'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:4px;height:fit-content',
        )}
      >
        {vm.tools.map((tl: any, i: number) => (
          <Box
            key={i}
            as="button"
            title={tl.label}
            css={`width:46px;height:46px;border-radius:10px;border:1px solid ${tl.bd};background:${tl.bg};cursor:pointer;display:flex;align-items:center;justify-content:center;color:${tl.fg}`}
            hover="border-color:var(--bd2)"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={tl.ic} />
            </svg>
          </Box>
        ))}
        <div style={css('height:1px;background:var(--bd);margin:6px 4px')}></div>
        <div
          style={css(
            'display:flex;flex-direction:column;gap:6px;align-items:center;padding:4px 0',
          )}
        >
          <div
            style={css(
              'width:22px;height:22px;border-radius:50%;background:var(--ac);cursor:pointer;border:2px solid #fff',
            )}
          ></div>
          <div
            style={css(
              'width:22px;height:22px;border-radius:50%;background:var(--ai);cursor:pointer',
            )}
          ></div>
          <div
            style={css(
              'width:22px;height:22px;border-radius:50%;background:var(--dng);cursor:pointer',
            )}
          ></div>
          <div
            style={css(
              'width:22px;height:22px;border-radius:50%;background:var(--warn);cursor:pointer',
            )}
          ></div>
        </div>
      </div>
      <div>
        <div
          style={css(
            'background:#0a0c0f;border:1px solid var(--bd);border-radius:14px;overflow:hidden',
          )}
        >
          <div style={css('position:relative;background:#0d1014')}>
            {vm.drawing}
            <span
              style={css(
                'position:absolute;top:12px;inset-inline-start:12px;display:inline-flex;align-items:center;gap:6px;background:var(--aid);color:var(--ai);font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px',
              )}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              {t.autoTracking}
            </span>
            <span
              style={css(
                'position:absolute;top:12px;inset-inline-end:12px;font-size:11px;font-weight:700;color:var(--good);background:rgba(74,222,128,.13);padding:4px 10px;border-radius:20px',
              )}
            >
              {t.confidence} ۹۳٪
            </span>
          </div>
          <div
            style={css(
              'padding:12px 16px;display:flex;align-items:center;gap:14px;border-top:1px solid var(--bd)',
            )}
          >
            <button
              style={css(
                'width:34px;height:34px;border-radius:9px;background:var(--ac);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center',
              )}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#0d0f12">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2" style={css('cursor:pointer')}>
              <path d="M11 19 2 12l9-7zM22 19l-9-7 9-7z" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2" style={css('cursor:pointer')}>
              <path d="M13 19l9-7-9-7zM2 19l9-7-9-7z" />
            </svg>
            <div style={css('flex:1')}></div>
            <div
              style={css(
                'display:flex;gap:6px;background:var(--bg2);border-radius:8px;padding:3px',
              )}
            >
              <button
                style={css(
                  'padding:5px 11px;border:none;border-radius:6px;background:transparent;color:var(--sub);font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer',
                )}
              >
                ×۱
              </button>
              <button
                style={css(
                  'padding:5px 11px;border:none;border-radius:6px;background:var(--card2);color:var(--ac);font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer',
                )}
              >
                ×۰٫۵
              </button>
              <button
                style={css(
                  'padding:5px 11px;border:none;border-radius:6px;background:transparent;color:var(--sub);font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer',
                )}
              >
                ×۰٫۲۵
              </button>
            </div>
          </div>
        </div>
        <div
          style={css(
            'background:linear-gradient(150deg,rgba(56,189,248,.07),var(--card) 55%);border:1px solid rgba(56,189,248,.2);border-radius:14px;padding:16px 18px;margin-top:14px',
          )}
        >
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:13px')}>
            <span
              style={css(
                'display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:var(--ai);background:var(--aid);padding:4px 11px;border-radius:20px',
              )}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
              {t.aiKeyMoments}
            </span>
            <span style={css('font-size:11.5px;color:var(--mut)')}>{t.aiMarkedDraw}</span>
          </div>
          <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:10px')}>
            {vm.moments.map((m: any, i: number) => (
              <Box
                key={i}
                css="background:var(--bg2);border:1px solid var(--bd);border-radius:11px;padding:12px 13px;cursor:pointer"
                hover="border-color:var(--bd2)"
              >
                <div
                  style={css(
                    'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px',
                  )}
                >
                  <span
                    style={css(
                      'font-family:monospace;font-size:11.5px;color:var(--ac);font-weight:700',
                    )}
                  >
                    {m.t}
                  </span>
                  <span
                    style={css(
                      `display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;color:${m.confC}`,
                    )}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                    </svg>
                    {m.conf}٪
                  </span>
                </div>
                <div
                  style={css(
                    'font-size:12.5px;font-weight:600;line-height:1.5;margin-bottom:10px',
                  )}
                >
                  {m.ty}
                </div>
                <button
                  style={css(
                    'width:100%;height:30px;background:var(--acd);border:1px solid rgba(163,230,53,.3);border-radius:8px;color:var(--ac);font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer',
                  )}
                >
                  {t.drawIt} →
                </button>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
