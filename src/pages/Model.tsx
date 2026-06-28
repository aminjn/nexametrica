import { Box } from '../components/Box'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { eng } from '../engine'

// Ported from prototype lines 965–1003. vm = v.vm (engine.vm_model()).
// Top block is REAL — the actual CV models + the latest video's processing facts.
export function Model({ e, v }: PageProps) {
  const t = v.t
  const vm = v.vm
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const job = useLatestPhysicalJob()
  const rr = (job as any)?.result || {}
  const vid = rr.video
  const phys = rr.physical

  const pipeline = job ? [
    { n: L('تشخیص (YOLO11)', 'Detection (YOLO11)'), ok: true, info: rr.model || 'yolo11m.pt' },
    { n: L('ردیابی (ByteTrack)', 'Tracking (ByteTrack)'), ok: !!rr.players, info: `${faN(rr.players?.unique_tracks ?? 0)} ${L('رد', 'tracks')}` },
    { n: L('تفکیکِ تیم (رنگ پیراهن)', 'Team split (jersey colour)'), ok: !!rr.teams, info: rr.single_team ? L('تک‌تیم', 'single kit') : L('دو تیم', 'two teams') },
    { n: L('کالیبراسیونِ زمین', 'Pitch calibration'), ok: !!rr.calibration_auto, info: rr.calibration_auto ? L('خودکار', 'automatic') : L('غیرفعال', 'off') },
    { n: L('Re-ID (اتصالِ ردها)', 'Re-ID (track stitching)'), ok: !!phys?.player_count, info: phys ? `${faN(phys.player_count)} ${L('بازیکن', 'players')}` : '—' },
    { n: L('شماره‌ی پیراهن (OCR)', 'Jersey OCR'), ok: !!phys?.numbered, info: phys?.numbered ? `${faN(phys.numbered)} ${L('خوانده‌شد', 'read')}` : L('غیرفعال/۰', 'off / 0') },
    { n: L('مالکیت و پاس', 'Possession & passes'), ok: !!rr.possession, info: rr.possession ? `${faN(rr.possession.a)}٪/${faN(rr.possession.b)}٪` : '—' },
  ] : []

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      {job ? (
        <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px')}>
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
            <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
            <div style={css('font-weight:800;font-size:15px')}>{L('وضعیتِ خطِ پردازشِ بینایی', 'Vision pipeline status')}</div>
            <span style={css('font-size:11.5px;color:var(--mut)')}>· {(job as any).name}</span>
          </div>
          {vid ? (
            <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:12px')}>
              {faN(vid.width)}×{faN(vid.height)} · {faN(vid.fps)}fps · {faN(rr.processed_frames)} {L('فریمِ پردازش‌شده', 'frames processed')}
              {vid.duration_sec ? ` · ${faN(Math.round(vid.duration_sec))}${L('ث', 's')}` : ''}
            </div>
          ) : null}
          <div style={css('display:flex;flex-direction:column;gap:6px')}>
            {pipeline.map((s, i) => (
              <div key={i} style={css('display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:9px;padding:9px 12px')}>
                <span style={css(`width:9px;height:9px;border-radius:50%;background:${s.ok ? 'var(--good)' : 'var(--mut)'}`)}></span>
                <span style={css('font-size:12.5px;font-weight:700;flex:1')}>{s.n}</span>
                <span style={css('font-size:11.5px;color:var(--mut)')}>{s.info}</span>
                <span style={css(`font-size:10.5px;font-weight:700;color:${s.ok ? 'var(--good)' : 'var(--mut)'}`)}>{s.ok ? L('فعال', 'active') : L('—', '—')}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
        <span style={css('background:var(--bd2);color:var(--mut);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px')}>{L('نمونه‌ی طراحی', 'Design sample')}</span>
      </div>
      <div
        style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px')}
      >
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px',
          )}
        >
          <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
            {t.gamesProcessed}
          </div>
          <div style={css('font-size:25px;font-weight:800')}>۱٬۲۴۸</div>
        </div>
        <div
          style={css(
            'background:linear-gradient(150deg,rgba(163,230,53,.1),var(--card) 60%);border:1px solid rgba(163,230,53,.25);border-radius:14px;padding:16px 18px',
          )}
        >
          <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
            {t.eventAccuracy}
          </div>
          <div style={css('display:flex;align-items:baseline;gap:7px')}>
            <span style={css('font-size:25px;font-weight:800;color:var(--ac)')}>۹۶٪</span>
            <span style={css('font-size:11px;font-weight:700;color:var(--good)')}>↑ ۱۱٪</span>
          </div>
        </div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px',
          )}
        >
          <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
            {t.learningLevel}
          </div>
          <div style={css('font-size:25px;font-weight:800;color:var(--ai)')}>۸۲٪</div>
          <div
            style={css(
              'height:5px;background:var(--raised);border-radius:6px;margin-top:9px;overflow:hidden',
            )}
          >
            <div style={css('width:82%;height:100%;background:var(--ai);border-radius:6px')}></div>
          </div>
        </div>
        <div
          style={css(
            'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px',
          )}
        >
          <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:8px')}>
            {t.recentCorrections}
          </div>
          <div style={css('font-size:25px;font-weight:800')}>۳۴۷</div>
        </div>
      </div>
      <div
        style={css(
          'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px 20px;margin-bottom:14px',
        )}
      >
        <div
          style={css(
            'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px',
          )}
        >
          <div>
            <div style={css('font-weight:700;font-size:14px')}>{t.modelAccuracy}</div>
            <div style={css('font-size:11.5px;color:var(--mut)')}>
              {t.eventAccuracy}: ۸۵٪ → ۹۶٪
            </div>
          </div>
          <span
            style={css(
              'display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--good);background:rgba(74,222,128,.13);padding:4px 11px;border-radius:20px',
            )}
          >
            <span
              style={css('width:7px;height:7px;border-radius:50%;background:var(--good)')}
            ></span>
            {t.feedsTraining}
          </span>
        </div>
        {vm.acc}
      </div>
      <div style={css('display:grid;grid-template-columns:1fr 1.2fr;gap:14px')}>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}
        >
          <div style={css('font-weight:700;font-size:14px;margin-bottom:16px')}>
            {t.eventAccuracy}
          </div>
          <div style={css('display:flex;flex-direction:column;gap:13px')}>
            {vm.evAcc.map((e: any, i: number) => (
              <div key={i}>
                <div
                  style={css(
                    'display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px',
                  )}
                >
                  <span style={css('color:var(--sub)')}>{e.k}</span>
                  <span style={css(`font-weight:700;color:${e.c}`)}>{e.vF}٪</span>
                </div>
                <div
                  style={css('height:6px;background:var(--raised);border-radius:6px;overflow:hidden')}
                >
                  <div
                    style={css(`height:100%;width:${e.v}%;background:${e.c};border-radius:6px`)}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}
        >
          <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:14px')}>
            <div style={css('font-weight:700;font-size:14px')}>{t.recentCorrections}</div>
            <span style={css('font-size:11px;color:var(--mut)')}>— {t.feedsTraining}</span>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            {vm.corrections.map((c: any, i: number) => (
              <div
                key={i}
                style={css(
                  'display:flex;align-items:center;gap:12px;padding:11px 13px;background:var(--bg2);border-radius:10px',
                )}
              >
                <div
                  style={css(
                    'width:30px;height:30px;border-radius:8px;background:var(--acd);display:flex;align-items:center;justify-content:center;flex-shrink:0',
                  )}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                  </svg>
                </div>
                <div style={css('flex:1;min-width:0')}>
                  <div style={css('font-size:12.5px;font-weight:600')}>{c.a}</div>
                  <div style={css('font-size:11px;color:var(--mut)')}>
                    {c.u} · {c.t}
                  </div>
                </div>
                <span
                  style={css(
                    'font-size:10px;font-weight:700;color:var(--good);background:rgba(74,222,128,.13);padding:2px 8px;border-radius:20px;white-space:nowrap',
                  )}
                >
                  + {t.learningLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
