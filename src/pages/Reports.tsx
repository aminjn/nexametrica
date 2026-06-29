import { useState } from 'react'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { generateReport } from '../api'

// Real — generates an AI report from the latest analysis's real numbers. No mock.
export function Reports({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result
  const [report, setReport] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  function buildContext() {
    const p = rr.physical || {}
    const lines: string[] = [`video: ${(job as any).name}`]
    if (rr.teams) lines.push(`teams: ${rr.teams.length}, single_kit: ${!!rr.single_team}`)
    if (rr.possession) lines.push(`possession A/B: ${rr.possession.a}%/${rr.possession.b}%`)
    if (p.passes) lines.push(`passes A/B: ${p.passes.a}/${p.passes.b}, accuracy A/B: ${p.passes.acc_a}%/${p.passes.acc_b}%`)
    if (p.player_count) lines.push(`players (Re-ID): ${p.player_count}`)
    if (p.teams) p.teams.forEach((tm: any) => lines.push(`team ${tm.team === 0 ? 'A' : 'B'}: total distance ${tm.distance_total_m} m, top speed ${tm.top_speed_kmh} km/h, players ${tm.players}`))
    if (p.sprints != null) lines.push(`sprints: ${p.sprints}`)
    return lines.join('\n')
  }

  async function onGenerate() {
    setBusy(true); setErr(''); setReport('')
    try {
      setReport(await generateReport(buildContext(), v.lang))
    } catch (e) {
      setErr(L('تولیدِ گزارش ناموفق بود (سرویسِ AI تنظیم نشده؟).', 'Report failed (AI provider not configured?).'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={css('max-width:1100px;margin:0 auto')}>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap')}>
          <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
          <div style={css('font-weight:800;font-size:15px')}>{L('گزارشِ هوشِ مصنوعی از آخرین آنالیز', 'AI report from latest analysis')}</div>
          <div style={css('flex:1')}></div>
          <button onClick={onGenerate} disabled={!rr?.physical || busy}
            style={css(`height:36px;padding:0 16px;background:${!rr?.physical || busy ? 'var(--card2)' : 'var(--ac)'};border:none;border-radius:9px;color:${!rr?.physical || busy ? 'var(--mut)' : '#0d0f12'};font-family:inherit;font-size:12.5px;font-weight:800;cursor:pointer`)}>
            {busy ? L('در حال نوشتن…', 'Writing…') : L('تولیدِ گزارش', 'Generate report')}
          </button>
        </div>
        {!rr?.physical ? (
          <div style={css('font-size:12px;color:var(--mut)')}>{L('اول یک ویدیو آنالیز کن تا گزارش از داده‌ی واقعی نوشته شود.', 'Analyse a video first to write a report from real data.')}</div>
        ) : null}
        {err ? <div style={css('font-size:12px;color:var(--dng)')}>{err}</div> : null}
        {report ? <div style={css('font-size:13px;color:#cdd2d8;line-height:1.9;white-space:pre-wrap;margin-top:6px')}>{report}</div> : null}
      </div>
    </div>
  )
}
