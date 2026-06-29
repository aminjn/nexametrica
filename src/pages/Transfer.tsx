import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { ManualList } from '../components/ManualList'

// Ported from prototype lines 1421–1465. Top block is REAL — your transfer targets.
export function Transfer({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <ManualList
        v={v}
        collection="transfer"
        title={L('اهدافِ نقل‌وانتقال', 'Transfer targets')}
        fields={[
          { key: 'player', ph: L('نامِ بازیکن', 'Player name') },
          { key: 'club', ph: L('باشگاه', 'Club'), width: '170px' },
          { key: 'value', ph: L('ارزش/قیمت', 'Value'), width: '130px' },
          { key: 'note', ph: L('وضعیت/یادداشت', 'Status / note') },
        ]}
      />
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
      </div>
    <div
      style={css(
        'display:grid;grid-template-columns:1fr 380px;gap:16px',
      )}
    >
      <div>
        <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:14px')}>
          <div style={css('font-weight:700;font-size:14px')}>{t.target}</div>
          <div style={css('flex:1')}></div>
          <button
            style={css(
              'height:34px;padding:0 14px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
            )}
          >
            {t.addTarget}
          </button>
        </div>
        <div style={css('display:flex;flex-direction:column;gap:12px')}>
          {vm.targets.map((tg: any, i: number) => (
            <Box
              key={i}
              css={`background:var(--card);border:1px solid ${tg.active};border-radius:14px;padding:16px 18px;display:flex;align-items:center;gap:16px;cursor:pointer`}
              hover="border-color:var(--bd2)"
            >
              <div
                style={css(
                  'width:48px;height:48px;border-radius:12px;background:var(--raised);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:var(--sub);flex-shrink:0',
                )}
              >
                {tg.scoreF}
              </div>
              <div style={css('flex:1;min-width:0')}>
                <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:3px')}>
                  <span style={css('font-size:14px;font-weight:700')}>{tg.name}</span>
                  <span
                    style={css(
                      'display:inline-flex;align-items:center;gap:4px;font-size:9px;font-weight:700;color:var(--ai);background:var(--aid);padding:1px 7px;border-radius:20px',
                    )}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
                    </svg>
                    AI
                  </span>
                </div>
                <div style={css('font-size:11.5px;color:var(--mut)')}>
                  {tg.posN} · {tg.clubN} · {t.age} {tg.age} · {tg.val}
                </div>
              </div>
              <div style={css('text-align:center;flex-shrink:0')}>
                <div style={css('font-size:11px;color:var(--mut);margin-bottom:5px')}>{t.buyScore}</div>
                <div
                  style={css(
                    'height:6px;width:90px;background:var(--raised);border-radius:6px;overflow:hidden',
                  )}
                >
                  <div
                    style={css(`height:100%;width:${tg.scoreF}%;background:${tg.sc};border-radius:6px`)}
                  ></div>
                </div>
              </div>
              <span
                style={css(
                  `font-size:10.5px;font-weight:700;color:${tg.recC};background:rgba(255,255,255,.05);padding:4px 11px;border-radius:20px;white-space:nowrap;flex-shrink:0`,
                )}
              >
                {tg.rec}
              </span>
            </Box>
          ))}
        </div>
      </div>
      <div>
        <div
          style={css(
            'background:linear-gradient(160deg,rgba(163,230,53,.08),var(--card) 50%);border:1px solid var(--bd);border-radius:16px;padding:20px;margin-bottom:14px',
          )}
        >
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:16px')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--ai)">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            <span style={css('font-size:11px;font-weight:800;color:var(--ai)')}>{t.transferAnalysis}</span>
            <span style={css('margin-inline-start:auto;font-size:11px;color:var(--sub)')}>
              {t.confidence} ۸۹٪
            </span>
          </div>
          <div style={css('display:flex;align-items:center;gap:18px;margin-bottom:18px')}>
            {vm.buyDonut}
            <div>
              <div style={css('font-size:17px;font-weight:800;margin-bottom:3px')}>{vm.selName}</div>
              <div style={css('font-size:12px;color:var(--sub);margin-bottom:8px')}>
                {t.estCost}: {vm.selVal}
              </div>
              <span
                style={css(
                  `font-size:11.5px;font-weight:800;color:${vm.selRecC};background:rgba(255,255,255,.05);padding:4px 12px;border-radius:20px`,
                )}
              >
                {vm.selRec}
              </span>
            </div>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:12px')}>
            {vm.factors.map((f: any, i: number) => (
              <div key={i}>
                <div style={css('display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px')}>
                  <span style={css('color:var(--sub)')}>{f.k}</span>
                  <span style={css(`font-weight:700;color:${f.c}`)}>{f.vF}</span>
                </div>
                <div style={css('height:6px;background:var(--raised);border-radius:6px;overflow:hidden')}>
                  <div style={css(`height:100%;width:${f.pct};background:${f.c};border-radius:6px`)}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px')}
        >
          <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:8px')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--ai)">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            <span style={css('font-size:12.5px;font-weight:700;color:var(--ai)')}>{t.recommend}</span>
          </div>
          <div style={css('font-size:12.5px;color:#cdd2d8;line-height:1.75')}>
            کیان عباسی در ۲۱ سالگی بالاترین تناسب سبک با فاز حمله‌ی جناحی تیم را دارد و سابقه‌ی مصدومیت پایینی ثبت شده است. با توجه به قرارداد رو به پایان، فرصت خرید به‌صرفه است. این تحلیل از پارامترهای فیزیکی، سابقه‌ی مصدومیت، ارزش بازار و بازیکن مشابه ساخته شده.
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
