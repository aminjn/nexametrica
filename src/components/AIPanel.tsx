import { Box } from './Box'
import { css } from '../lib/css'
import type { PageProps } from '../pages/types'

// Ported from prototype lines 1820–1857: the slide-out personalized AI assistant
// panel (available on every page) plus its click-away backdrop.
export function AIPanel({ v }: PageProps) {
  return (
    <>
      <div
        onClick={v.toggleAI}
        style={css(
          `position:fixed;inset:0;background:rgba(4,6,9,.45);z-index:40;opacity:${v.aiOverlayOpacity};pointer-events:${v.aiPointer};transition:opacity .3s`,
        )}
      ></div>
      <aside
        style={css(
          `position:fixed;top:0;inset-inline-end:0;height:100vh;width:392px;max-width:92vw;background:var(--bg2);border-inline-start:1px solid var(--bd);z-index:41;display:flex;flex-direction:column;transform:${v.aiTransform};transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:-20px 0 60px rgba(0,0,0,.4)`,
        )}
      >
        <div
          style={css(
            'padding:16px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:11px',
          )}
        >
          <div
            style={css(
              'width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#38bdf8,#0ea5e9);display:flex;align-items:center;justify-content:center',
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#06141f">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10l6-1.6Z" />
            </svg>
          </div>
          <div style={css('flex:1')}>
            <div style={css('font-weight:800;font-size:14px')}>{v.t.aiName}</div>
            <div
              style={css(
                'font-size:11px;color:var(--ai);display:flex;align-items:center;gap:5px',
              )}
            >
              <span
                style={css(
                  'width:6px;height:6px;border-radius:50%;background:var(--ai);animation:nx-pulse 1.8s infinite',
                )}
              ></span>
              {v.t.aiPersonalized}
            </div>
          </div>
          <button
            onClick={v.toggleAI}
            style={css(
              'width:32px;height:32px;border-radius:8px;background:var(--card);border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--sub)',
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          style={css(
            'flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px',
          )}
        >
          <div style={css('display:flex;gap:10px')}>
            <div
              style={css(
                'width:30px;height:30px;border-radius:8px;background:var(--aid);display:flex;align-items:center;justify-content:center;flex-shrink:0',
              )}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--ai)">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10l6-1.6Z" />
              </svg>
            </div>
            <div
              style={css(
                'background:var(--card);border:1px solid var(--bd);border-radius:4px 14px 14px 14px;padding:12px 14px;font-size:12.5px;line-height:1.7;color:#cdd2d8',
              )}
            >
              {v.t.aiHello}
            </div>
          </div>
          {v.aiThread.map((msg: any, i: number) => (
            <div
              key={i}
              style={css(
                `display:flex;gap:10px;flex-direction:${msg.dir};align-self:${msg.align};max-width:88%`,
              )}
            >
              <div
                style={css(
                  `background:${msg.bg};border:1px solid ${msg.bd};border-radius:14px;padding:12px 14px;font-size:12.5px;line-height:1.7;color:${msg.color}`,
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div style={css('margin-top:auto;padding-top:8px')}>
            <div style={css('font-size:11px;color:var(--mut);margin-bottom:8px;font-weight:600')}>
              {v.t.quickQuestions}
            </div>
            <div style={css('display:flex;flex-wrap:wrap;gap:7px')}>
              {v.vm_ai_quick.map((q: any, i: number) => (
                <Box
                  key={i}
                  as="button"
                  onClick={q.go}
                  css="background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:7px 12px;font-size:11.5px;color:var(--sub);font-family:inherit;cursor:pointer;text-align:start"
                  hover="border-color:var(--ai);color:var(--tx)"
                >
                  {q.text}
                </Box>
              ))}
            </div>
          </div>
        </div>

        <div style={css('padding:14px 16px;border-top:1px solid var(--bd)')}>
          <div
            style={css(
              'display:flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:5px 6px 5px 14px',
            )}
          >
            <input
              value={v.aiInput}
              onInput={v.onAiInput}
              onChange={v.onAiInput}
              placeholder={v.t.askPlaceholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') v.sendAi()
              }}
              style={css(
                'flex:1;background:none;border:none;outline:none;color:var(--tx);font-family:inherit;font-size:13px',
              )}
            />
            <button
              onClick={v.sendAi}
              style={css(
                'width:34px;height:34px;border-radius:9px;background:var(--ai);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0',
              )}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#06141f"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: 'scaleX(-1)' }}
              >
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </div>
          <div style={css('font-size:10px;color:var(--mut);text-align:center;margin-top:8px')}>
            {v.t.aiAdapts}
          </div>
        </div>
      </aside>
    </>
  )
}
