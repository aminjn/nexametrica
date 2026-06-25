import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 866–901. vm = v.vm (engine.vm_reports()).
export function Reports({ v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div style={css('max-width:1100px;margin:0 auto')}>
      <div
        style={css('display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center')}
      >
        {vm.repTypes.map((rt: any, i: number) => (
          <Box
            key={i}
            as="button"
            onClick={rt.set}
            css={`height:38px;padding:0 15px;background:${rt.bg};border:1px solid ${rt.bd};border-radius:9px;color:${rt.fg};font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer`}
          >
            {rt.label}
          </Box>
        ))}
        <div style={css('flex:1')}></div>
        <button
          style={css(
            'height:38px;padding:0 16px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px',
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          {t.downloadPdf}
        </button>
      </div>
      <div
        style={css('background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:24px 28px')}
      >
        <div
          style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}
        >
          <div style={css('font-weight:800;font-size:16px')}>{vm.repTitle}</div>
          <span style={css('font-size:12px;color:var(--mut)')}>پارس تهران · فصل ۱۴۰۳–۰۴</span>
        </div>
        {vm.isTeamRep ? (
          <>
            <div
              style={css(
                'display:flex;align-items:center;justify-content:center;gap:30px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--bd)',
              )}
            >
              <div style={css('text-align:center')}>
                <div
                  style={css(
                    'width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,#a3e635,#65a30d);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#0d0f12;margin:0 auto 8px',
                  )}
                >
                  پت
                </div>
                <div style={css('font-weight:700;font-size:14px')}>{t.us}</div>
              </div>
              <div style={css('font-size:28px;font-weight:800;letter-spacing:1px')}>
                ۲ <span style={css('color:var(--mut);font-size:18px')}>–</span> ۱
              </div>
              <div style={css('text-align:center')}>
                <div
                  style={css(
                    'width:46px;height:46px;border-radius:12px;background:var(--raised);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:var(--sub);margin:0 auto 8px',
                  )}
                >
                  زا
                </div>
                <div style={css('font-weight:700;font-size:14px;color:var(--sub)')}>{t.them}</div>
              </div>
            </div>
            <div style={css('display:flex;flex-direction:column;gap:16px')}>
              {vm.cmpBars.map((b: any, i: number) => (
                <div
                  key={i}
                  style={css(
                    'display:grid;grid-template-columns:42px 1fr 130px 1fr 42px;align-items:center;gap:12px',
                  )}
                >
                  <span
                    style={css(
                      'font-family:monospace;font-size:13px;font-weight:700;color:var(--ac);text-align:end',
                    )}
                  >
                    {b.av}
                  </span>
                  <div
                    style={css(
                      'height:8px;background:var(--raised);border-radius:6px;display:flex;justify-content:flex-end;overflow:hidden',
                    )}
                  >
                    <div
                      style={css(`height:100%;width:${b.ap}%;background:var(--ac);border-radius:6px`)}
                    ></div>
                  </div>
                  <span style={css('font-size:12px;color:var(--sub);text-align:center;font-weight:600')}>
                    {b.k}
                  </span>
                  <div style={css('height:8px;background:var(--raised);border-radius:6px;overflow:hidden')}>
                    <div
                      style={css(`height:100%;width:${b.bp}%;background:var(--mut);border-radius:6px`)}
                    ></div>
                  </div>
                  <span
                    style={css(
                      'font-family:monospace;font-size:13px;font-weight:700;color:var(--sub);text-align:start',
                    )}
                  >
                    {b.bv}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}
        <div
          style={css(
            'margin-top:22px;padding:16px;background:linear-gradient(150deg,rgba(56,189,248,.06),transparent);border:1px solid rgba(56,189,248,.2);border-radius:12px',
          )}
        >
          <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:8px')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ai)">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            <span style={css('font-size:12.5px;font-weight:700;color:var(--ai)')}>{t.aiInsights}</span>
            <span style={css('margin-inline-start:auto;font-size:11px;color:var(--sub)')}>
              {t.confidence} <b style={css('color:var(--ai)')}>۹۳٪</b>
            </span>
          </div>
          <div style={css('font-size:13px;color:#cdd2d8;line-height:1.7')}>{vm.repSummary}</div>
        </div>
      </div>
    </div>
  )
}
