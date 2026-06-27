// Real video-AI panel for the Library page: upload a match video (queued for the
// Z440 GPU worker), see live job status, and view real results (player/ball
// stats + occupancy heatmap) produced by YOLO11 + ByteTrack.
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { css } from '../lib/css'
import { Box } from './Box'
import { uploadVideo, listJobs, deleteJob, type Job } from '../api'
import { eng } from '../engine'
import { Heatmap } from './Heatmap'
import { Calibration } from './Calibration'
import { Physical } from './Physical'

const STATUS: Record<string, { fa: string; en: string; c: string }> = {
  queued: { fa: 'در صف', en: 'Queued', c: 'var(--warn)' },
  processing: { fa: 'در حال پردازش', en: 'Processing', c: 'var(--ai)' },
  done: { fa: 'آماده', en: 'Done', c: 'var(--good)' },
  failed: { fa: 'ناموفق', en: 'Failed', c: 'var(--dng)' },
}

export function VideoJobs({ v }: { v: Record<string, any> }) {
  const fa = v.lang === 'fa'
  const L = (f: string, e: string) => (fa ? f : e)
  const faN = (s: any) => (eng as any).faN(s)

  const [jobs, setJobs] = useState<Job[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [calib, setCalib] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function refresh() {
    try {
      const r = await listJobs()
      setJobs(r.jobs)
    } catch {
      /* API may be down in dev; ignore */
    }
  }

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 4000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onDelete(e: React.MouseEvent, j: Job) {
    e.stopPropagation()
    if (!window.confirm(L(`«${j.name}» حذف شود؟`, `Delete "${j.name}"?`))) return
    setJobs((js) => js.filter((x) => x.id !== j.id))   // optimistic
    if (open === j.id) setOpen(null)
    try {
      await deleteJob(j.id)
    } catch {
      refresh()   // revert on failure
    }
  }

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    setMsg(L('در حال آپلود…', 'Uploading…'))
    try {
      await uploadVideo(f)
      setMsg(L('آپلود شد — در صفِ پردازشِ worker.', 'Uploaded — queued for the worker.'))
      refresh()
    } catch (err) {
      setMsg(L('آپلود نشد: ', 'Upload failed: ') + String((err as Error).message))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div
      style={css(
        'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:16px',
      )}
    >
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap')}>
        <span
          style={css(
            'display:flex;align-items:center;gap:6px;background:var(--aid);color:var(--ai);font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px',
          )}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
          </svg>
          {L('پردازش واقعی AI', 'Real AI processing')}
        </span>
        <div style={css('font-weight:800;font-size:15px')}>{L('ویدیوها و تحلیل بینایی', 'Videos & vision analysis')}</div>
        <div style={css('flex:1')}></div>
        <input ref={fileRef} type="file" accept="video/*" onChange={onPick} style={{ display: 'none' }} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          style={css(
            'height:38px;padding:0 18px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer',
          )}
        >
          {L('+ آپلود ویدیو', '+ Upload video')}
        </button>
      </div>
      <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:14px')}>
        {L(
          'ویدیو در صف قرار می‌گیرد و workerِ GPU (Z440) آن را با YOLO11 + ByteTrack پردازش می‌کند.',
          'The video is queued and processed by the GPU worker (Z440) with YOLO11 + ByteTrack.',
        )}
      </div>
      {msg ? (
        <div style={css('font-size:12px;color:var(--sub);margin-bottom:12px')}>{msg}</div>
      ) : null}

      {jobs.length === 0 ? (
        <div style={css('font-size:12.5px;color:var(--mut);padding:14px 0;text-align:center')}>
          {L('هنوز ویدیویی پردازش نشده. یک ویدیو آپلود کن یا روی Z440 با worker پردازش کن.', 'No videos yet. Upload one, or process on the Z440 worker.')}
        </div>
      ) : (
        <div style={css('display:flex;flex-direction:column;gap:8px')}>
          {jobs.map((j) => {
            const st = STATUS[j.status] || STATUS.queued
            const expanded = open === j.id
            const r = j.result
            return (
              <div key={j.id} style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:11px;overflow:hidden')}>
                <Box
                  onClick={() => setOpen(expanded ? null : j.id)}
                  css="display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer"
                  hover="background:var(--card)"
                >
                  <div
                    style={css(
                      'width:38px;height:38px;border-radius:9px;background:var(--raised);display:flex;align-items:center;justify-content:center;flex-shrink:0',
                    )}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={st.c} strokeWidth="1.8">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m10 9 5 3-5 3z" fill={st.c} stroke="none" />
                    </svg>
                  </div>
                  <div style={css('flex:1;min-width:0')}>
                    <div style={css('font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>
                      {j.name}
                    </div>
                    <div style={css('font-size:10.5px;color:var(--mut)')}>
                      {j.source === 'worker' ? L('پردازشِ محلی', 'local process') : L('آپلودِ سایت', 'site upload')}
                      {r?.players ? ` · ${faN(r.players.unique_tracks)} ${L('بازیکن', 'players')}` : ''}
                    </div>
                  </div>
                  {j.status === 'processing' ? (
                    <span
                      style={css('width:8px;height:8px;border-radius:50%;background:var(--ai);animation:nx-pulse 1.2s infinite')}
                    ></span>
                  ) : null}
                  <span
                    style={css(
                      `font-size:10.5px;font-weight:700;color:${st.c};background:var(--card);padding:3px 10px;border-radius:20px;white-space:nowrap`,
                    )}
                  >
                    {fa ? st.fa : st.en}
                  </span>
                  <Box
                    onClick={(e: React.MouseEvent) => onDelete(e, j)}
                    css="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer;flex-shrink:0"
                    hover="background:var(--dngd);color:var(--dng)"
                    title={L('حذف ویدیو', 'Delete video')}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </Box>
                </Box>
                {expanded && r ? (
                  <div style={css('padding:0 14px 16px;border-top:1px solid var(--bd)')}>
                    <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0')}>
                      {[
                        [L('بازیکن (میانگین)', 'Players (avg)'), r.players?.avg],
                        [L('بیشینه', 'Max'), r.players?.max],
                        [L('ردِ یکتا', 'Unique tracks'), r.players?.unique_tracks],
                        [L('تشخیص توپ', 'Ball detections'), r.ball?.detections],
                      ].map(([lab, val], i) => (
                        <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:11px 12px')}>
                          <div style={css('font-size:10.5px;color:var(--sub);margin-bottom:5px')}>{lab as string}</div>
                          <div style={css('font-size:19px;font-weight:800')}>{faN(val ?? 0)}</div>
                        </div>
                      ))}
                    </div>
                    {r.teams ? (
                      <div style={css('display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap')}>
                        {r.teams.map((tm: any, ti: number) => (
                          <div
                            key={ti}
                            style={css(
                              'display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--bd);border-radius:9px;padding:8px 12px',
                            )}
                          >
                            <span style={css(`width:13px;height:13px;border-radius:4px;background:${tm.color};border:1px solid rgba(255,255,255,.25)`)}></span>
                            <span style={css('font-size:12px;font-weight:700')}>
                              {L('تیم', 'Team')} {ti === 0 ? 'A' : 'B'}
                            </span>
                            <span style={css('font-size:11px;color:var(--mut)')}>
                              {L('میانگین', 'avg')} {faN(tm.players_avg)} {L('بازیکن', 'players')}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {r.heatmap_a && r.heatmap_b && r.teams ? (
                      <div>
                        <div style={css('font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:8px')}>
                          {L('نقشه‌ی حرارتیِ هر تیم (از ردیابی)', 'Per-team occupancy heatmap (from tracking)')}
                        </div>
                        <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:12px')}>
                          <div>
                            <div style={css('font-size:10.5px;font-weight:700;margin-bottom:5px;display:flex;align-items:center;gap:6px')}>
                              <span style={css(`width:11px;height:11px;border-radius:3px;background:${r.teams[0].color};border:1px solid rgba(255,255,255,.25)`)}></span>
                              {L('تیم A', 'Team A')}
                            </div>
                            <Heatmap grid={r.heatmap_a} />
                          </div>
                          <div>
                            <div style={css('font-size:10.5px;font-weight:700;margin-bottom:5px;display:flex;align-items:center;gap:6px')}>
                              <span style={css(`width:11px;height:11px;border-radius:3px;background:${r.teams[1].color};border:1px solid rgba(255,255,255,.25)`)}></span>
                              {L('تیم B', 'Team B')}
                            </div>
                            <Heatmap grid={r.heatmap_b} />
                          </div>
                        </div>
                      </div>
                    ) : r.heatmap ? (
                      <div>
                        <div style={css('font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:8px')}>
                          {L('نقشه‌ی حرارتیِ حضور بازیکنان (از ردیابی)', 'Player occupancy heatmap (from tracking)')}
                        </div>
                        <Heatmap grid={r.heatmap} />
                      </div>
                    ) : null}
                    {r.video ? (
                      <div style={css('font-size:10.5px;color:var(--mut);margin-top:10px')}>
                        {faN(r.video.width)}×{faN(r.video.height)} · {faN(r.video.fps)}fps ·{' '}
                        {faN(r.processed_frames)} {L('فریمِ پردازش‌شده', 'frames processed')} · {r.model}
                      </div>
                    ) : null}
                    {/* automatic per-frame calibration → real physical analytics */}
                    {r.calibration_auto && r.physical ? <Physical v={v} job={j} /> : null}
                    {(j as any).calibratable ? (
                      <div style={css('margin-top:12px')}>
                        <button
                          onClick={() => setCalib(calib === j.id ? null : j.id)}
                          style={css(
                            'height:34px;padding:0 15px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--ac);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px',
                          )}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 3v18" />
                          </svg>
                          {calib === j.id
                            ? L('بستن کالیبراسیون', 'Close calibration')
                            : r.calibration_auto
                              ? L('کالیبراسیون دستی (اختیاری)', 'Manual calibration (optional)')
                              : L('کالیبراسیون زمین', 'Field calibration')}
                        </button>
                        {calib === j.id ? <Calibration v={v} job={j} /> : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {expanded && j.status === 'failed' ? (
                  <div style={css('padding:12px 14px;border-top:1px solid var(--bd);font-size:11.5px;color:var(--dng)')}>
                    {j.error}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
