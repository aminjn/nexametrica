import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { useRosterFull, bmiOf, bmiColor } from '../lib/useRoster'
import { eng } from '../engine'

// Real — the Re-ID players from the latest analysed video, with each player's
// body profile (name + BMI) from the roster when the shirt number matches. No mock.
export function Player({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const roster = useRosterFull()
  const job = useLatestPhysicalJob()
  const players = (job as any)?.result?.physical?.players as any[] | undefined
  const single = !!(job as any)?.result?.single_team || !!(job as any)?.single_override
  const teamsMeta = (job as any)?.result?.teams || []
  const colorOf = (i: number) => teamsMeta[i]?.color || (i === 0 ? '#4f86ff' : '#ff5a5a')

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {players?.length ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('بازیکنانِ آخرین آنالیز', 'Players from latest analysis')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          <div style={css('display:flex;font-size:11px;color:var(--mut);font-weight:700;padding:0 10px 8px')}>
            <span style={css('width:84px')}>{L('بازیکن', 'Player')}</span>
            <span style={css('width:120px')}>{L('نام', 'Name')}</span>
            {!single ? <span style={css('width:54px')}>{L('تیم', 'Team')}</span> : null}
            <span style={css('flex:1;text-align:center')}>{L('مسافت', 'Distance')}</span>
            <span style={css('width:90px;text-align:center')}>{L('بیشینه سرعت', 'Top speed')}</span>
            <span style={css('width:74px;text-align:center')}>{L('زمان', 'Time')}</span>
            <span style={css('width:70px;text-align:center')}>BMI</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:3px;max-height:430px;overflow:auto')}>
            {players.map((p: any) => {
              const prof = p.number ? roster[String(p.number)] : undefined
              const bmi = bmiOf(prof)
              return (
              <Box key={p.player} css="display:flex;align-items:center;font-size:12.5px;padding:8px 10px;border-radius:8px;background:var(--bg2)" hover="background:var(--card2)">
                <span style={css('width:84px;display:inline-flex;align-items:center;gap:6px')}>
                  {p.number ? (
                    <span style={css('min-width:22px;height:22px;padding:0 5px;border-radius:6px;background:var(--ac);color:#0d0f12;font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:12px')}>{faN(p.number)}</span>
                  ) : (
                    <span style={css('color:var(--mut);font-weight:700')}>{L('بازیکن', 'P')} {faN(p.player)}</span>
                  )}
                </span>
                <span style={css('width:120px;font-weight:700;color:var(--sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-inline-end:6px')}>{prof?.name || '—'}</span>
                {!single ? (
                  <span style={css('width:54px')}><span style={css(`width:12px;height:12px;border-radius:3px;display:inline-block;background:${p.team === -1 ? 'var(--mut)' : colorOf(p.team)}`)}></span></span>
                ) : null}
                <span style={css('flex:1;text-align:center;font-weight:700')}>{p.distance_m >= 1000 ? `${faN((p.distance_m / 1000).toFixed(2))} ${L('کم', 'km')}` : `${faN(Math.round(p.distance_m))} ${L('م', 'm')}`}</span>
                <span style={css('width:90px;text-align:center;font-family:monospace')}>{faN(p.max_speed_kmh)} {L('ک/س', 'km/h')}</span>
                <span style={css('width:74px;text-align:center;color:var(--mut)')}>{faN(Math.round(p.seconds))}{L('ث', 's')}</span>
                <span style={css('width:70px;text-align:center')}>
                  {bmi ? <span style={css(`font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:20px;color:#0d0f12;background:${bmiColor(bmi)}`)}>{faN(bmi)}</span> : <span style={css('color:var(--mut)')}>—</span>}
                </span>
              </Box>
              )
            })}
          </div>
        </div>
      ) : (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:16px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز بازیکنِ واقعی‌ای نیست. یک ویدیو در «کتابخانه ویدیو» آنالیز کن تا بازیکنانِ ردیابی‌شده اینجا بیایند.',
            'No real players yet. Analyse a video in “Video Library” and tracked players will appear here.')}
        </div>
      )}
    </div>
  )
}
