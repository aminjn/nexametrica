import { css } from '../lib/css'
import type { PageProps } from './types'

// Ported from prototype lines 1156–1177. vm = v.vm (engine.vm_dataint()).
export function DataInt({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px')}>
        {vm.conns.map((c: any, i: number) => (
          <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
            <div style={css('display:flex;align-items:flex-start;gap:12px;margin-bottom:14px')}>
              <div style={css('width:40px;height:40px;border-radius:11px;background:var(--bg2);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tx)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={c.ic} />
                </svg>
              </div>
              <div style={css('flex:1')}>
                <div style={css('font-weight:700;font-size:14px')}>{c.n}</div>
                <div style={css('font-size:11.5px;color:var(--mut);line-height:1.5;margin-top:2px')}>{c.d}</div>
              </div>
            </div>
            <div style={css('display:flex;align-items:center;justify-content:space-between')}>
              <span style={css(`display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:${c.sc};background:${c.sb};padding:4px 11px;border-radius:20px`)}>
                <span style={css(`width:6px;height:6px;border-radius:50%;background:${c.sc}`)}></span>{c.label}
              </span>
              <button style={css('height:32px;padding:0 14px;background:var(--card2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer')}>{c.btn}</button>
            </div>
          </div>
        ))}
      </div>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px')}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:14px')}>
          <div style={css('font-weight:700;font-size:14px')}>{t.codeLib}</div>
          <span style={css('font-size:11px;color:var(--mut);font-family:monospace')}>Python / R</span>
        </div>
        <div style={css('background:#0a0c0f;border:1px solid var(--bd);border-radius:11px;padding:16px 18px;font-family:monospace;font-size:12.5px;line-height:1.9;color:#cdd2d8;white-space:pre;overflow-x:auto')}>{vm.snippet}</div>
      </div>
    </div>
  )
}
