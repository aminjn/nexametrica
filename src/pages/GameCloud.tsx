import { useEffect, useState } from 'react'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { listJobs, type Job } from '../api'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { downloadText } from '../lib/download'
import { eng } from '../engine'

// Real — storage/usage stats computed from your actual analysed videos, plus a
// working coordinate/metrics export from the latest analysis. No mock.
export function GameCloud({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const [jobs, setJobs] = useState<Job[]>([])
  useEffect(() => {
    listJobs().then((r) => setJobs(r.jobs || [])).catch(() => {})
  }, [])
  const job = useLatestPhysicalJob()

  const done = jobs.filter((j) => j.status === 'done')
  const totalFrames = done.reduce((s, j) => s + ((j as any).result?.processed_frames || 0), 0)
  const totalSec = done.reduce((s, j) => s + ((j as any).result?.video?.duration_sec || 0), 0)
  const totalPlayers = done.reduce((s, j) => s + ((j as any).result?.physical?.player_count || 0), 0)
  const hrs = Math.floor(totalSec / 3600)
  const mins = Math.round((totalSec % 3600) / 60)

  function exportCsv() {
    const r = (job as any)?.result
    const players: any[] = r?.physical?.players || []
    const rows = [['player', 'number', 'team', 'distance_m', 'max_speed_kmh', 'seconds']]
    players.forEach((p) => rows.push([p.player, p.number ?? '', p.team ?? '', p.distance_m ?? '', p.max_speed_kmh ?? '', Math.round(p.seconds ?? 0)]))
    downloadText(`${(job as any)?.name || 'analysis'}-players.csv`, rows.map((x) => x.join(',')).join('\n'), 'text/csv')
  }
  function exportJson() {
    downloadText(`${(job as any)?.name || 'analysis'}.json`, JSON.stringify((job as any)?.result ?? {}, null, 2), 'application/json')
  }

  const stats: [string, string, string][] = [
    [L('ویدیوهای آنالیزشده', 'Analysed videos'), faN(done.length), ''],
    [L('فریمِ پردازش‌شده', 'Frames processed'), faN(totalFrames.toLocaleString('en-US')), ''],
    [L('زمانِ کلِ ویدیو', 'Total footage'), `${faN(hrs)}${L('س', 'h')} ${faN(mins)}${L('د', 'm')}`, ''],
    [L('بازیکنانِ ردیابی‌شده', 'Players tracked'), faN(totalPlayers), ''],
  ]

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
        <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
        <div style={css('font-weight:800;font-size:15px')}>{L('فضای ابری و خروجیِ داده', 'Cloud & data export')}</div>
      </div>

      {/* real usage stats */}
      <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px')}>
        {stats.map(([lab, val], i) => (
          <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px')}>
            <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>{lab}</div>
            <div style={css('font-size:24px;font-weight:800')}>{val}</div>
          </div>
        ))}
      </div>

      <div style={css('display:grid;grid-template-columns:1fr 1.2fr;gap:14px')}>
        {/* real export */}
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:6px')}>{L('خروجیِ مختصات و آمار', 'Coordinates & metrics export')}</div>
          <div style={css('font-size:12px;color:var(--sub);line-height:1.7;margin-bottom:14px')}>
            {job
              ? L(`از «${(job as any).name}» — آمارِ واقعیِ هر بازیکن.`, `From “${(job as any).name}” — real per-player metrics.`)
              : L('اول یک ویدیو آنالیز کن تا خروجی بگیری.', 'Analyse a video first to export.')}
          </div>
          <div style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:13px;font-family:monospace;font-size:11px;color:var(--mut);line-height:1.8;margin-bottom:14px;overflow-x:auto')}>
            player,number,team,distance_m,max_speed_kmh,seconds
          </div>
          <div style={css('display:flex;gap:8px')}>
            <button onClick={exportCsv} disabled={!job} style={css(`flex:1;height:36px;background:${job ? 'var(--card2)' : 'var(--card)'};border:1px solid var(--bd2);border-radius:9px;color:${job ? 'var(--tx)' : 'var(--mut)'};font-family:inherit;font-size:12px;font-weight:700;cursor:${job ? 'pointer' : 'default'}`)}>CSV</button>
            <button onClick={exportJson} disabled={!job} style={css(`flex:1;height:36px;background:${job ? 'var(--card2)' : 'var(--card)'};border:1px solid var(--bd2);border-radius:9px;color:${job ? 'var(--tx)' : 'var(--mut)'};font-family:inherit;font-size:12px;font-weight:700;cursor:${job ? 'pointer' : 'default'}`)}>JSON</button>
          </div>
        </div>

        {/* real recent activity */}
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px')}>
          <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{L('فعالیتِ اخیر', 'Recent activity')}</div>
          {jobs.length ? (
            <div style={css('display:flex;flex-direction:column;gap:8px;max-height:340px;overflow:auto')}>
              {jobs.slice(0, 12).map((j) => {
                const st = j.status === 'done' ? ['var(--good)', L('انجام‌شده', 'done')] : j.status === 'error' ? ['var(--dng)', L('خطا', 'error')] : ['var(--ai)', L('در حال پردازش', 'processing')]
                return (
                  <div key={j.id} style={css('display:flex;align-items:center;gap:12px;padding:11px 13px;background:var(--bg2);border-radius:10px')}>
                    <span style={css(`width:8px;height:8px;border-radius:50%;background:${st[0]};flex-shrink:0`)}></span>
                    <div style={css('flex:1;min-width:0')}>
                      <div style={css('font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{j.name}</div>
                      <div style={css('font-size:11px;color:var(--mut)')}>{(j as any).result?.physical?.player_count ? `${faN((j as any).result.physical.player_count)} ${L('بازیکن', 'players')}` : j.source || ''}</div>
                    </div>
                    <span style={css(`font-family:monospace;font-size:11px;font-weight:700;color:${st[0]}`)}>{st[1]}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={css('font-size:12px;color:var(--mut);text-align:center;padding:10px')}>{L('هنوز ویدیویی آپلود نشده.', 'No videos uploaded yet.')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
