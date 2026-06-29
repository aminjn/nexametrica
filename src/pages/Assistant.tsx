import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'

// Real — the chat talks to the backend LLM (see aiWire.ts: persona + history +
// lang are sent to /assistant/chat). The personalization toggles really shape
// the persona. Removed the fake chat-history list and fake "learned about you".
export function Assistant({ v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div
      style={css(
        'max-width:1320px;margin:0 auto;display:grid;grid-template-columns:1fr 308px;gap:16px;height:calc(100vh - 130px)',
      )}
    >
      <div
        style={css(
          'background:var(--card);border:1px solid var(--bd);border-radius:14px;display:flex;flex-direction:column;min-height:0;overflow:hidden',
        )}
      >
        <div style={css('display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--bd)')}>
          <div style={css('font-weight:800;font-size:14px')}>{t.assistant}</div>
          <div style={css('flex:1')}></div>
          <button
            onClick={v.newChat}
            style={css('height:34px;padding:0 14px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-weight:700;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:6px')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t.assistant}
          </button>
        </div>
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
                  `background:${m.bg};border:1px solid ${m.bd};border-radius:14px;padding:13px 16px;font-size:13px;line-height:1.75;color:${m.color};white-space:pre-wrap`,
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
              onKeyDown={(ev: any) => { if (ev.key === 'Enter') v.sendAi() }}
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
          <div style={css('font-size:10.5px;color:var(--mut);line-height:1.7;margin-top:14px;padding-top:12px;border-top:1px solid var(--bd)')}>
            {v.lang === 'fa'
              ? 'این تنظیمات همراهِ پیامِ تو به مدلِ زبانی فرستاده می‌شوند و لحنِ پاسخ را تغییر می‌دهند.'
              : 'These settings are sent with your message to the language model and shape the tone of its answers.'}
          </div>
        </div>
      </div>
    </div>
  )
}
