import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Ported from prototype lines 1090–1128. vm = v.vm (engine.vm_coding()).
// Top block is REAL — the detected event log (passes/recoveries) from the analysis.
export function Coding({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const events = (rr.physical?.passes?.events as any[]) || []
  const teamsMeta = rr.teams || []
  const colorOf = (i: number) => teamsMeta[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {events.length ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('رویدادهای تشخیص‌داده‌شده', 'Detected events')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {faN(events.length)} {L('رویداد', 'events')}</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:3px;max-height:440px;overflow:auto')}>
            {events.map((ev: any, i: number) => (
              <div key={i} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:7px 11px')}>
                <span style={css('font-family:monospace;font-size:11.5px;color:var(--mut);width:48px')}>{mmss(ev.t)}</span>
                <span style={css(`width:10px;height:10px;border-radius:3px;background:${colorOf(ev.team)}`)}></span>
                <span style={css(`font-size:11px;font-weight:700;color:${ev.type === 'pass' ? 'var(--ac)' : 'var(--warn)'};width:74px`)}>
                  {ev.type === 'pass' ? L('پاس', 'Pass') : L('توپ‌ربایی', 'Recovery')}
                </span>
                <span style={css('font-size:12px;color:var(--sub);flex:1')}>
                  {ev.type === 'pass' && ev.from && ev.to
                    ? `${L('بازیکن', 'P')} ${faN(ev.from)} ← ${L('بازیکن', 'P')} ${faN(ev.to)}`
                    : `${L('تیم', 'Team')} ${ev.team === 0 ? 'A' : 'B'}`}
                </span>
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
        'display:grid;grid-template-columns:1fr 320px;gap:16px',
      )}
    >
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
        <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:16px')}>
          <span
            style={css(
              'display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:var(--ai);background:var(--aid);padding:5px 11px;border-radius:20px',
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            {t.smartTagging}
          </span>
          <div style={css('flex:1')}></div>
          <div style={css('display:flex;background:var(--bg2);border-radius:9px;padding:3px')}>
            <button
              style={css(
                'padding:7px 14px;border:none;border-radius:7px;background:var(--ac);color:#0d0f12;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
              )}
            >
              {t.livePost}
            </button>
            <button
              style={css(
                'padding:7px 14px;border:none;border-radius:7px;background:transparent;color:var(--sub);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
              )}
            >
              {t.liveTag}
            </button>
          </div>
          <button
            style={css(
              'height:34px;padding:0 13px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
            )}
          >
            {t.xmlExport}
          </button>
        </div>
        <div style={css('font-size:11px;color:var(--mut);font-weight:700;margin-bottom:10px')}>
          {t.codeBtns}
        </div>
        <div
          style={css('display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-bottom:16px')}
        >
          {vm.codes.map((cd: any, i: number) => (
            <Box
              key={i}
              as="button"
              css={`position:relative;padding:14px 8px;background:var(--bg2);border:1px solid var(--bd);border-top:2px solid ${cd.c};border-radius:10px;cursor:pointer;font-family:inherit;text-align:center`}
              hover="border-color:var(--bd2)"
            >
              <div style={css('font-size:13px;font-weight:700;color:var(--tx)')}>{cd.l}</div>
              <div style={css('font-size:10px;color:var(--mut);margin-top:3px')}>
                {cd.n} {t.shortcut} ·{' '}
                <span style={css(`font-family:monospace;color:${cd.c}`)}>{cd.sc}</span>
              </div>
            </Box>
          ))}
          <button
            style={css(
              'padding:14px 8px;background:transparent;border:1px dashed var(--bd2);border-radius:10px;cursor:pointer;font-family:inherit;color:var(--sub);font-size:12px;font-weight:600',
            )}
          >
            {t.addCode}
          </button>
        </div>
        <div
          style={css(
            'display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding-top:14px;border-top:1px solid var(--bd)',
          )}
        >
          <span style={css('font-size:11px;color:var(--mut);font-weight:700')}>{t.labelBtns}:</span>
          <span
            style={css(
              'font-size:11.5px;padding:5px 11px;background:var(--bg2);border:1px solid var(--bd);border-radius:20px;color:var(--sub)',
            )}
          >
            نیمه اول
          </span>
          <span
            style={css(
              'font-size:11.5px;padding:5px 11px;background:var(--bg2);border:1px solid var(--bd);border-radius:20px;color:var(--sub)',
            )}
          >
            نیمه دوم
          </span>
          <span
            style={css(
              'font-size:11.5px;padding:5px 11px;background:var(--bg2);border:1px solid var(--bd);border-radius:20px;color:var(--sub)',
            )}
          >
            زمین خودی
          </span>
          <span
            style={css(
              'font-size:11.5px;padding:5px 11px;background:var(--bg2);border:1px solid var(--bd);border-radius:20px;color:var(--sub)',
            )}
          >
            زمین حریف
          </span>
          <div style={css('flex:1')}></div>
          <button
            style={css(
              'font-size:11.5px;padding:6px 12px;background:var(--warnd);border:1px solid rgba(245,158,11,.3);border-radius:20px;color:var(--warn);font-family:inherit;font-weight:700;cursor:pointer',
            )}
          >
            {t.addFlag}
          </button>
        </div>
      </div>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
        <div
          style={css(
            'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px',
          )}
        >
          <div style={css('font-weight:700;font-size:13px')}>{t.generatedCodes}</div>
          <span style={css('font-size:11px;color:var(--mut)')}>۶۲۸ {t.totalEvents}</span>
        </div>
        <div style={css('display:flex;flex-direction:column;gap:7px')}>
          {vm.gen.map((g: any, i: number) => (
            <div
              key={i}
              style={css(
                'display:flex;align-items:center;gap:10px;padding:9px 11px;background:var(--bg2);border-radius:9px',
              )}
            >
              <span
                style={css(
                  'font-family:monospace;font-size:11.5px;color:var(--mut);min-width:42px',
                )}
              >
                {g.t}
              </span>
              <span style={css('flex:1;font-size:12.5px;font-weight:600')}>{g.ty}</span>
              <span
                style={css(
                  `display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;color:${g.confC}`,
                )}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                </svg>
                {g.conf}٪
              </span>
              <button
                style={css(
                  'width:24px;height:24px;border-radius:6px;background:transparent;border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--sub)',
                )}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}
