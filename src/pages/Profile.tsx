import { useState } from 'react'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useCollection } from '../lib/useCollection'
import type { RosterPlayer } from '../lib/useRoster'
import { bmiOf, bmiColor } from '../lib/useRoster'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Real — a player profile driven by your roster (body profile + measurements),
// joined with the player's real physical stats from the latest analysis when the
// jersey number was detected. No mock.
export function Profile({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const { rows } = useCollection<RosterPlayer>('roster', [])
  const [sel, setSel] = useState(0)
  const job = useLatestPhysicalJob()
  const players = (job as any)?.result?.physical?.players as any[] | undefined

  const sorted = [...rows].sort((a, b) => Number(a.number) - Number(b.number))
  const p = sorted[sel]
  const bmi = p ? bmiOf(p) : null
  const stat = p && players ? players.find((x) => String(x.number) === String(p.number)) : undefined

  const bmiBand = (b: number) =>
    b < 18.5 ? L('کمبودِ وزن', 'Underweight') : b < 25 ? L('نرمال', 'Normal') : b < 30 ? L('اضافه‌وزن', 'Overweight') : L('چاق', 'Obese')

  return (
    <div style={css('max-width:1100px;margin:0 auto')}>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
        <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
        <div style={css('font-weight:800;font-size:15px')}>{L('پروفایلِ بازیکن', 'Player profile')}</div>
        {sorted.length ? (
          <select value={sel} onChange={(e) => setSel(Number(e.target.value))} style={css('height:34px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 10px;cursor:pointer;margin-inline-start:auto')}>
            {sorted.map((pl, i) => (
              <option key={pl.id} value={i}>#{pl.number} — {pl.name}</option>
            ))}
          </select>
        ) : null}
      </div>

      {!p ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;font-size:12.5px;color:var(--mut);line-height:1.8')}>
          {L('هنوز بازیکنی در روستر نیست. در «دیتابیس لیگ / روستر» بازیکن اضافه کن (با قد/وزن/اندازه‌ها) تا پروفایلش اینجا بیاید.',
            'No roster players yet. Add players (with height/weight/measurements) in “League DB / roster” and their profile will appear here.')}
        </div>
      ) : (
        <>
          {/* header */}
          <div style={css('background:linear-gradient(110deg,rgba(163,230,53,.08),var(--card) 45%);border:1px solid var(--bd);border-radius:16px;padding:22px;display:flex;align-items:center;gap:20px;margin-bottom:14px;flex-wrap:wrap')}>
            <div style={css('width:64px;height:64px;border-radius:16px;background:var(--ac);color:#0d0f12;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;flex-shrink:0')}>{faN(p.number)}</div>
            <div style={css('flex:1;min-width:160px')}>
              <div style={css('font-size:22px;font-weight:800')}>{p.name}</div>
              <div style={css('font-size:13px;color:var(--sub);margin-top:3px')}>{p.position || L('بدونِ پست', 'No position')}</div>
            </div>
            {bmi ? (
              <div style={css('text-align:center;padding:0 18px;border-inline-start:1px solid var(--bd)')}>
                <div style={css('font-size:11px;color:var(--mut);margin-bottom:4px')}>BMI</div>
                <div style={css(`font-size:28px;font-weight:800;color:${bmiColor(bmi)}`)}>{faN(bmi)}</div>
                <div style={css('font-size:10px;color:var(--mut)')}>{bmiBand(bmi)}</div>
              </div>
            ) : null}
          </div>

          {/* body profile */}
          <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px;margin-bottom:14px')}>
            <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{L('پروفایلِ بدنی', 'Body profile')}</div>
            <div style={css('display:grid;grid-template-columns:repeat(6,1fr);gap:10px')}>
              {[
                [L('قد', 'Height'), p.height ? `${faN(p.height)} cm` : '—'],
                [L('وزن', 'Weight'), p.weight ? `${faN(p.weight)} kg` : '—'],
                [L('دورِ ران', 'Thigh'), p.thigh ? `${faN(p.thigh)} cm` : '—'],
                [L('دورِ ساق', 'Calf'), p.calf ? `${faN(p.calf)} cm` : '—'],
                [L('دورِ سینه', 'Chest'), p.chest ? `${faN(p.chest)} cm` : '—'],
                [L('دورِ بازو', 'Arm'), p.arm ? `${faN(p.arm)} cm` : '—'],
              ].map(([k, val], i) => (
                <div key={i} style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:12px 13px')}>
                  <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:6px')}>{k}</div>
                  <div style={css('font-size:14px;font-weight:700')}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* real physical stats from latest analysis (if detected) */}
          <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px')}>
            <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap')}>
              <div style={css('font-weight:700;font-size:14px')}>{L('آمارِ فیزیکی از آخرین آنالیز', 'Physical stats from latest analysis')}</div>
              {job ? <span style={css('font-size:11px;color:var(--mut)')}>· {(job as any).name}</span> : null}
            </div>
            {stat ? (
              <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:10px')}>
                {[
                  [L('مسافت', 'Distance'), stat.distance_m >= 1000 ? `${faN((stat.distance_m / 1000).toFixed(2))} ${L('کیلومتر', 'km')}` : `${faN(Math.round(stat.distance_m))} ${L('متر', 'm')}`],
                  [L('بیشینه سرعت', 'Top speed'), `${faN(stat.max_speed_kmh)} ${L('کیلومتر/ساعت', 'km/h')}`],
                  [L('زمانِ حضور', 'Time on pitch'), `${faN(Math.round(stat.seconds))} ${L('ثانیه', 's')}`],
                ].map(([k, val], i) => (
                  <div key={i} style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:13px 14px')}>
                    <div style={css('font-size:10.5px;color:var(--mut);margin-bottom:6px')}>{k}</div>
                    <div style={css('font-size:18px;font-weight:800')}>{val}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={css('font-size:12px;color:var(--mut);line-height:1.8')}>
                {players
                  ? L(`شماره‌ی ${faN(p.number)} در آخرین آنالیز شناسایی نشد. اگر شماره‌ی پیراهن در ویدیو خوانده شود، آمارش اینجا می‌آید.`, `Shirt #${p.number} wasn’t detected in the latest analysis. Once its jersey number is read, stats appear here.`)
                  : L('هنوز ویدیویی آنالیز نشده. یک ویدیو در «کتابخانه ویدیو» آنالیز کن.', 'No analysis yet. Analyse a video in “Video Library”.')}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
