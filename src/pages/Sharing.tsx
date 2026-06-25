import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 1179–1233 (the is_sharing block). vm = v.vm (engine.vm_sharing()).
export function Sharing({ v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div style={css('max-width:1320px;margin:0 auto;display:grid;grid-template-columns:1fr 340px;gap:16px')}>
      <div>
        <div style={css('display:flex;align-items:center;gap:12px;margin-bottom:14px')}>
          <div style={css('font-weight:700;font-size:14px')}>{t.sharedClips}</div>
          <div style={css('flex:1')}></div>
          <div style={css('display:flex;align-items:center;gap:7px;background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:5px 12px 5px 6px')}>
            <div style={css('display:flex')}>
              {vm.online.map((o: any, i: number) => (
                <span key={i} style={css(`width:24px;height:24px;border-radius:50%;background:${o.c};color:#0d0f12;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;margin-inline-start:-6px;border:2px solid var(--bg2)`)}>{o.ini}</span>
              ))}
            </div>
            <span style={css('font-size:11.5px;color:var(--good);font-weight:600')}>۳ {t.analystsOnline}</span>
          </div>
        </div>
        <div style={css('display:flex;flex-direction:column;gap:12px')}>
          {vm.clips.map((c: any, i: number) => (
            <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:13px;padding:14px;display:flex;gap:14px')}>
              <div style={css('width:120px;aspect-ratio:16/9;border-radius:9px;background:repeating-linear-gradient(125deg,#1b1f26,#1b1f26 9px,#191d23 9px,#191d23 18px);display:flex;align-items:center;justify-content:center;flex-shrink:0')}><div style={css('width:32px;height:32px;border-radius:50%;background:rgba(13,15,18,.55);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.15)')}><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg></div></div>
              <div style={css('flex:1;min-width:0')}>
                <div style={css('font-weight:600;font-size:13.5px;margin-bottom:6px')}>{c.t}</div>
                <div style={css('display:flex;align-items:center;gap:8px;font-size:11px;color:var(--mut);margin-bottom:10px')}><span>{c.by}</span><span>·</span><span>{c.t2}</span></div>
                <div style={css('display:flex;align-items:center;gap:10px')}>
                  <span style={css('display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--ac);background:var(--acd);padding:3px 10px;border-radius:20px')}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0" /></svg>@{c.tg}</span>
                  <span style={css('display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:var(--sub)')}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>{c.cm} {t.comments}</span>
                  <div style={css('flex:1')}></div>
                  <button style={css('width:30px;height:30px;border-radius:8px;background:var(--bg2);border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--sub)')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={css('margin-top:14px;display:flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:6px 6px 6px 14px')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mut)" strokeWidth="2"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 1 1 16-3.8z" /></svg>
          <input placeholder={`${t.addComment}  ·  ${t.mentionHint}`} style={css('flex:1;background:none;border:none;outline:none;color:var(--tx);font-family:inherit;font-size:13px')} />
          <button style={css('height:34px;padding:0 16px;background:var(--ac);border:none;border-radius:9px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer')}>{t.send}</button>
        </div>
      </div>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;display:flex;flex-direction:column;height:calc(100vh - 130px)')}>
        <div style={css('padding:15px 17px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:9px')}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg><div style={css('font-weight:700;font-size:13.5px')}>{t.messenger}</div><span style={css('margin-inline-start:auto;width:8px;height:8px;border-radius:50%;background:var(--good)')}></span></div>
        <div style={css('flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px')}>
          {vm.msgs.map((m: any, i: number) => (
            <div key={i} style={css(`align-self:${m.align};max-width:85%`)}>
              <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:4px;padding:0 4px')}>{m.name}</div>
              <div style={css(`background:${m.bg};border:1px solid ${m.bd};border-radius:13px;padding:11px 14px;font-size:12.5px;line-height:1.7;color:#cdd2d8`)}>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={css('padding:13px 15px;border-top:1px solid var(--bd);display:flex;align-items:center;gap:9px;background:var(--bg2);border-radius:0 0 14px 14px')}>
          <input placeholder={t.addComment} style={css('flex:1;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:9px 12px;outline:none;color:var(--tx);font-family:inherit;font-size:12.5px')} />
          <button style={css('width:34px;height:34px;border-radius:9px;background:var(--ac);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d0f12" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={css('transform:scaleX(-1)')}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></svg></button>
        </div>
      </div>
    </div>
  )
}
