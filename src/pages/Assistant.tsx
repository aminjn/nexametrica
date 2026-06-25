import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 903–963. vm = v.vm (engine.vm_assistant()).
export function Assistant({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div
      style={css(
        'max-width:1320px;margin:0 auto;display:grid;grid-template-columns:240px 1fr 308px;gap:16px;height:calc(100vh - 130px)',
      )}
    >
      <div style={css('display:flex;flex-direction:column;gap:12px;min-height:0')}>
        <button
          onClick={v.newChat}
          style={css(
            'height:40px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px',
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d0f12" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t.assistant}
        </button>
        <div style={css('font-size:11px;color:var(--mut);font-weight:700;padding:0 4px')}>{t.chatHistory}</div>
        <div style={css('display:flex;flex-direction:column;gap:6px;overflow-y:auto')}>
          {vm.history.map((hh: any, i: number) => (
            <Box
              key={i}
              as="button"
              css={`display:flex;flex-direction:column;gap:3px;padding:10px 13px;border:1px solid ${hh.bd};border-radius:10px;background:${hh.bg};cursor:pointer;font-family:inherit;text-align:start`}
              hover="border-color:var(--bd2)"
            >
              <span style={css('font-size:12.5px;font-weight:600')}>{hh.t}</span>
              <span style={css('font-size:10.5px;color:var(--mut)')}>{hh.d}</span>
            </Box>
          ))}
        </div>
      </div>
      <div
        style={css(
          'background:var(--card);border:1px solid var(--bd);border-radius:14px;display:flex;flex-direction:column;min-height:0;overflow:hidden',
        )}
      >
        <div style={css('flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px')}>
          <div style={css('display:flex;gap:11px')}>
            <div
              style={css(
                'width:32px;height:32px;border-radius:9px;background:var(--aid);display:flex;align-items:center;justify-content:center;flex-shrink:0',
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ai)">
                <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
              </svg>
            </div>
            <div
              style={css(
                'background:var(--bg2);border:1px solid var(--bd);border-radius:4px 14px 14px 14px;padding:13px 16px;font-size:13px;line-height:1.75;color:#cdd2d8;max-width:78%',
              )}
            >
              {t.aiHello}
            </div>
          </div>
          {v.aiThread.map((m: any, i: number) => (
            <div key={i} style={css(`align-self:${m.align};max-width:78%`)}>
              <div
                style={css(
                  `background:${m.bg};border:1px solid ${m.bd};border-radius:14px;padding:13px 16px;font-size:13px;line-height:1.75;color:${m.color}`,
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div style={css('padding:14px 16px;border-top:1px solid var(--bd)')}>
          <div style={css('display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px')}>
            {v.vm_ai_quick.map((q: any, i: number) => (
              <Box
                key={i}
                as="button"
                onClick={q.go}
                css="background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:7px 13px;font-size:11.5px;color:var(--sub);font-family:inherit;cursor:pointer"
                hover="border-color:var(--ai);color:var(--tx)"
              >
                {q.text}
              </Box>
            ))}
          </div>
          <div
            style={css(
              'display:flex;align-items:center;gap:9px;background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:5px 6px 5px 14px',
            )}
          >
            <input
              value={v.aiInput}
              onInput={v.onAiInput}
              onChange={v.onAiInput}
              placeholder={t.askPlaceholder}
              style={css('flex:1;background:none;border:none;outline:none;color:var(--tx);font-family:inherit;font-size:13px')}
            />
            <button
              onClick={v.sendAi}
              style={css(
                'width:36px;height:36px;border-radius:9px;background:var(--ai);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0',
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
                style={css('transform:scaleX(-1)')}
              >
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div style={css('display:flex;flex-direction:column;gap:14px;overflow-y:auto;min-height:0')}>
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:4px')}>{t.personalization}</div>
          <div style={css('font-size:11px;color:var(--mut);margin-bottom:16px')}>{t.aiAdapts}</div>
          <div style={css('display:flex;flex-direction:column;gap:16px')}>
            {vm.segments.map((sg: any, i: number) => (
              <div key={i}>
                <div style={css('font-size:12px;color:var(--sub);margin-bottom:8px;font-weight:600')}>{sg.title}</div>
                <div style={css('display:flex;gap:5px;background:var(--bg2);border-radius:9px;padding:3px')}>
                  {sg.opts.map((o: any, j: number) => (
                    <button
                      key={j}
                      onClick={o.set}
                      style={css(
                        `flex:1;padding:7px 4px;border:none;border-radius:7px;background:${o.bg};color:${o.fg};font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer;transition:all .15s`,
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={css(
            'background:linear-gradient(160deg,rgba(56,189,248,.07),var(--card) 55%);border:1px solid rgba(56,189,248,.2);border-radius:14px;padding:18px',
          )}
        >
          <div style={css('display:flex;align-items:center;gap:7px;margin-bottom:14px')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--ai)">
              <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
            </svg>
            <span style={css('font-weight:700;font-size:13px;color:var(--ai)')}>{t.learnedAbout}</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:11px')}>
            {vm.learned.map((ln: any, i: number) => (
              <div key={i} style={css('display:flex;gap:9px;align-items:flex-start')}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ai)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  style={css('margin-top:3px;flex-shrink:0')}
                >
                  <path d="m20 6-11 11-5-5" />
                </svg>
                <div style={css('font-size:12px;color:#cdd2d8;line-height:1.6')}>{ln}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
