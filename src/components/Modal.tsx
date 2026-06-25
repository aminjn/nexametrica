import { css } from '../lib/css'
import type { PageProps } from '../pages/types'

// Ported from prototype lines 1859–1890: the shared add/edit modal driven by
// openModal()/submitModal() in the engine (used by Schedule, etc.).
export function Modal({ v }: PageProps) {
  const m = v.modal
  if (!m.open) return null
  return (
    <div
      onClick={m.close}
      style={css(
        'position:fixed;inset:0;background:rgba(4,6,9,.62);backdrop-filter:blur(3px);z-index:60;display:flex;align-items:center;justify-content:center;padding:24px',
      )}
    >
      <div
        onClick={m.stop}
        style={css(
          'width:430px;max-width:94vw;background:var(--bg2);border:1px solid var(--bd2);border-radius:18px;box-shadow:0 28px 70px rgba(0,0,0,.6);overflow:hidden',
        )}
      >
        <div
          style={css(
            'display:flex;align-items:center;gap:11px;padding:18px 20px;border-bottom:1px solid var(--bd)',
          )}
        >
          <div
            style={css(
              'width:34px;height:34px;border-radius:10px;background:var(--acd);display:flex;align-items:center;justify-content:center;flex-shrink:0',
            )}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={m.icon} />
            </svg>
          </div>
          <div style={css('flex:1;font-size:15.5px;font-weight:800;color:var(--tx)')}>{m.title}</div>
          <button
            onClick={m.close}
            style={css(
              'width:30px;height:30px;border-radius:8px;background:var(--card);border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--sub)',
            )}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div
          style={css(
            'padding:18px 20px;display:flex;flex-direction:column;gap:14px;max-height:60vh;overflow:auto',
          )}
        >
          {m.fields.map((f: any) => (
            <label key={f.key} style={css('display:flex;flex-direction:column;gap:7px')}>
              <span style={css('font-size:12px;font-weight:700;color:var(--sub)')}>{f.label}</span>
              {f.isSelect ? (
                <select
                  value={f.value}
                  onChange={f.onInput}
                  style={css(
                    'height:44px;background:var(--card);border:1px solid var(--bd2);border-radius:11px;color:var(--tx);font-family:inherit;font-size:13.5px;font-weight:600;padding:0 12px;outline:none;cursor:pointer',
                  )}
                >
                  {f.options.map((o: any) => (
                    <option key={o.v} value={o.v}>
                      {o.l}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={f.value}
                  type={f.inputType}
                  onInput={f.onInput}
                  onChange={f.onInput}
                  placeholder={f.placeholder}
                  style={css(
                    'height:44px;background:var(--card);border:1px solid var(--bd2);border-radius:11px;color:var(--tx);font-family:inherit;font-size:13.5px;font-weight:600;padding:0 13px;outline:none',
                  )}
                />
              )}
            </label>
          ))}
        </div>
        <div
          style={css(
            'display:flex;gap:10px;padding:16px 20px;border-top:1px solid var(--bd);background:var(--card)',
          )}
        >
          <button
            onClick={m.close}
            style={css(
              'flex:1;height:44px;background:var(--card2);border:1px solid var(--bd2);border-radius:11px;color:var(--sub);font-family:inherit;font-size:13px;font-weight:700;cursor:pointer',
            )}
          >
            {m.cancelLabel}
          </button>
          <button
            onClick={m.submit}
            style={css(
              'flex:1.5;height:44px;background:var(--ac);border:none;border-radius:11px;color:#0d0f12;font-family:inherit;font-size:13.5px;font-weight:800;cursor:pointer',
            )}
          >
            {m.submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
