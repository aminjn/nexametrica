import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 1767–1812. vm = v.vm (engine.vm_nutrition()).
export function Nutrition({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div style={css('max-width:1340px;margin:0 auto')}>
      <div
        style={css(
          'background:linear-gradient(160deg,rgba(56,189,248,.08),var(--card) 55%);border:1px solid var(--bd);border-radius:14px;padding:15px 17px;margin-bottom:16px',
        )}
      >
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:8px')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ai)">
            <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
          </svg>
          <span style={css('font-size:12px;font-weight:800;color:var(--ai)')}>{t.aiProposal}</span>
          <span style={css('margin-inline-start:auto;font-size:11px;color:var(--sub)')}>
            {t.confidence} {vm.conf}٪
          </span>
        </div>
        <div style={css('font-size:13px;color:#cdd2d8;line-height:1.8')}>{vm.why.text}</div>
        <button
          onClick={vm.why.onWhy}
          style={css(
            'margin-top:8px;display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--ai)',
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
      <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
        {vm.rows.map((r: any, i: number) => (
          <div
            key={i}
            style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px')}
          >
            <div style={css('display:flex;align-items:center;gap:12px;margin-bottom:14px')}>
              <div style={css('flex:1')}>
                <div style={css('font-size:14px;font-weight:700')}>{r.n}</div>
                <div style={css('font-size:11px;color:var(--mut);margin-top:2px')}>
                  {r.pos} · {r.goal}
                </div>
              </div>
              <div style={css('text-align:center')}>
                <div style={css('font-size:17px;font-weight:800;color:var(--ac)')}>{r.kcal}</div>
                <div style={css('font-size:9.5px;color:var(--mut)')}>kcal/{t.day}</div>
              </div>
            </div>
            <div style={css('display:flex;height:8px;border-radius:5px;overflow:hidden;margin-bottom:8px')}>
              <div style={css(`width:${r.pPct};background:var(--ac)`)}></div>
              <div style={css(`width:${r.cbPct};background:var(--ai)`)}></div>
              <div style={css(`width:${r.fPct};background:var(--warn)`)}></div>
            </div>
            <div style={css('display:flex;gap:14px;margin-bottom:14px')}>
              <div style={css('display:flex;align-items:center;gap:5px')}>
                <span style={css('width:8px;height:8px;border-radius:2px;background:var(--ac)')}></span>
                <span style={css('font-size:11px;color:var(--sub)')}>
                  {t.protein} {r.p}
                </span>
              </div>
              <div style={css('display:flex;align-items:center;gap:5px')}>
                <span style={css('width:8px;height:8px;border-radius:2px;background:var(--ai)')}></span>
                <span style={css('font-size:11px;color:var(--sub)')}>
                  {t.carbs} {r.cb}
                </span>
              </div>
              <div style={css('display:flex;align-items:center;gap:5px')}>
                <span style={css('width:8px;height:8px;border-radius:2px;background:var(--warn)')}></span>
                <span style={css('font-size:11px;color:var(--sub)')}>
                  {t.fat} {r.f}
                </span>
              </div>
            </div>
            <div style={css('padding:10px 12px;background:var(--bg2);border-radius:9px;margin-bottom:13px')}>
              <div style={css('font-size:10px;color:var(--mut);margin-bottom:3px')}>{t.customDrill}</div>
              <div style={css('font-size:12.5px;font-weight:600')}>{r.drill}</div>
            </div>
            <div style={css('display:flex;align-items:center;gap:10px')}>
              <span
                style={css(
                  `font-size:11.5px;font-weight:700;color:${r.stC};background:${r.stBg};padding:5px 12px;border-radius:20px`,
                )}
              >
                {r.stL}
              </span>
              {r.approved ? (
                <span style={css('font-size:11px;color:var(--mut)')}>✓ {r.approver}</span>
              ) : null}
              <div style={css('flex:1')}></div>
              {r.canApproveRow ? (
                <button
                  onClick={r.approve}
                  style={css(
                    'height:32px;padding:0 14px;background:var(--good);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer',
                  )}
                >
                  ✓ {t.approve}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
