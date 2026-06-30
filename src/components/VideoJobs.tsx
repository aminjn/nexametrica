// Real video-AI panel for the Library page: drag-and-drop upload (queued for the
// Z440 GPU worker), real library stats, per-video thumbnails from the analysis
// keyframe, rename/title, delete, re-analyze, and the full real results
// (player/ball stats, possession, heatmaps, physical analytics, calibration).
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { css } from '../lib/css'
import { Box } from './Box'
import { uploadVideo, listJobs, getJob, deleteJob, reprocessJob, setSingleTeam, renameJob, type Job } from '../api'
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
  const [drag, setDrag] = useState(false)
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  const [srcType, setSrcType] = useState('broadcast')
  const fileRef = useRef<HTMLInputElement>(null)

  const SOURCES: { id: string; fa: string; en: string }[] = [
    { id: 'broadcast', fa: 'پخش تلویزیونی', en: 'Broadcast' },
    { id: 'tactical', fa: 'دوربین تاکتیکی', en: 'Tactical cam' },
    { id: 'drone', fa: 'پهپاد', en: 'Drone' },
    { id: 'mobile', fa: 'موبایل', en: 'Mobile' },
    { id: 'live', fa: 'فید زنده IP', en: 'Live IP feed' },
  ]
  const srcLabel = (id?: string) => {
    const s = SOURCES.find((x) => x.id === id)
    return s ? (fa ? s.fa : s.en) : ''
  }

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

  // lazily fetch one keyframe per done job for the card thumbnail (cached by id)
  useEffect(() => {
    let alive = true
    const need = jobs.filter((j) => j.status === 'done' && thumbs[j.id] === undefined)
    need.forEach(async (j) => {
      try {
        const full = await getJob(j.id)
        const r: any = full.result || {}
        const t = r.calibration_check || r.keyframe || (r.keyframes && r.keyframes[0]) || ''
        if (alive) setThumbs((m) => ({ ...m, [j.id]: t }))
      } catch {
        if (alive) setThumbs((m) => ({ ...m, [j.id]: '' }))
      }
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs])

  async function doUpload(f: File) {
    setBusy(true)
    setMsg(L('در حال آپلود…', 'Uploading…'))
    try {
      await uploadVideo(f, srcType)
      setMsg(L(`آپلود شد (${srcLabel(srcType)}) — در صفِ پردازشِ worker.`, `Uploaded (${srcLabel(srcType)}) — queued for the worker.`))
      refresh()
    } catch (err) {
      setMsg(L('آپلود نشد: ', 'Upload failed: ') + String((err as Error).message))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }
  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) doUpload(f)
  }
  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith('video/')) doUpload(f)
    else if (f) setMsg(L('فقط فایلِ ویدیویی پشتیبانی می‌شود.', 'Only video files are supported.'))
  }

  async function onDelete(e: React.MouseEvent, j: Job) {
    e.stopPropagation()
    if (!window.confirm(L(`«${j.name}» حذف شود؟`, `Delete "${j.name}"?`))) return
    setJobs((js) => js.filter((x) => x.id !== j.id))
    if (open === j.id) setOpen(null)
    try { await deleteJob(j.id) } catch { refresh() }
  }
  async function onRename(e: React.MouseEvent, j: Job) {
    e.stopPropagation()
    const name = window.prompt(L('عنوانِ ویدیو:', 'Video title:'), j.name)
    if (!name || name.trim() === j.name) return
    setJobs((js) => js.map((x) => (x.id === j.id ? ({ ...x, name: name.trim() } as Job) : x)))
    try { await renameJob(j.id, name.trim()) } catch { refresh() }
  }
  async function onToggleSingle(j: Job) {
    const next = !(j as any).single_override
    setJobs((js) => js.map((x) => (x.id === j.id ? ({ ...x, single_override: next } as Job) : x)))
    try { await setSingleTeam(j.id, next) } catch { refresh() }
  }
  async function onReprocess(e: React.MouseEvent, j: Job) {
    e.stopPropagation()
    setJobs((js) => js.map((x) => (x.id === j.id ? { ...x, status: 'queued', result: null } as Job : x)))
    setThumbs((m) => { const c = { ...m }; delete c[j.id]; return c })
    try {
      await reprocessJob(j.id)
      setMsg(L('در صفِ تحلیلِ مجدد قرار گرفت.', 'Re-queued for analysis.'))
    } catch {
      setMsg(L('تحلیلِ مجدد ممکن نشد (ویدیو روی سرور نیست).', 'Reprocess failed (no stored video).'))
      refresh()
    }
  }

  const done = jobs.filter((x) => x.status === 'done')
  const proc = jobs.filter((x) => x.status === 'queued' || x.status === 'processing')
  const totalSec = done.reduce((s, j) => s + ((j as any).result?.video?.duration_sec || 0), 0)
  const mins = Math.round(totalSec / 60)

  const cardCss = 'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px'

  return (
    <div>
      {/* header + drag-and-drop upload */}
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:14px')}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap')}>
          <span style={css('display:flex;align-items:center;gap:6px;background:var(--aid);color:var(--ai);font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" /></svg>
            {L('پردازش واقعی AI', 'Real AI processing')}
          </span>
          <div style={css('font-weight:800;font-size:15px')}>{L('ویدیوها و تحلیل بینایی', 'Videos & vision analysis')}</div>
          <div style={css('flex:1')}></div>
          <input ref={fileRef} type="file" accept="video/*" onChange={onPick} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} disabled={busy}
            style={css('height:38px;padding:0 18px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer')}>
            {L('+ آپلود ویدیو', '+ Upload video')}
          </button>
        </div>
        <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:14px')}>
          {L('ویدیو در صف قرار می‌گیرد و workerِ GPU (Z440) آن را با YOLO11 + ByteTrack پردازش می‌کند.',
            'The video is queued and processed by the GPU worker (Z440) with YOLO11 + ByteTrack.')}
        </div>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          style={css(`display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:26px;border:2px dashed ${drag ? 'var(--ac)' : 'var(--bd2)'};border-radius:14px;background:${drag ? 'var(--acd)' : 'var(--bg2)'};cursor:pointer;transition:all .15s`)}
        >
          <div style={css(`width:50px;height:50px;border-radius:14px;background:${drag ? 'var(--ac)' : 'var(--raised)'};display:flex;align-items:center;justify-content:center`)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={drag ? '#0d0f12' : 'var(--sub)'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>
          <div style={css('font-size:13.5px;font-weight:700')}>{busy ? L('در حال آپلود…', 'Uploading…') : L('ویدیو را بکشید و رها کنید', 'Drag & drop a video')}</div>
          <div style={css('font-size:11px;color:var(--mut)')}>{L('یا کلیک کنید — MOV ،MP4 تا ۸K', 'or click — MP4, MOV up to 8K')}</div>
        </div>
        {/* source type — passed to the worker so it adapts to drone / tactical / mobile / live */}
        <div style={css('display:flex;align-items:center;gap:8px;margin-top:12px;flex-wrap:wrap')} onClick={(e) => e.stopPropagation()}>
          <span style={css('font-size:11px;color:var(--mut);font-weight:700')}>{L('نوعِ منبع:', 'Source:')}</span>
          {SOURCES.map((s) => {
            const on = srcType === s.id
            return (
              <button key={s.id} onClick={() => setSrcType(s.id)}
                style={css(`height:30px;padding:0 12px;border-radius:20px;border:1px solid ${on ? 'var(--ac)' : 'var(--bd2)'};background:${on ? 'var(--acd)' : 'transparent'};color:${on ? 'var(--ac)' : 'var(--sub)'};font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer`)}>
                {fa ? s.fa : s.en}
              </button>
            )
          })}
        </div>
        {msg ? <div style={css('font-size:12px;color:var(--sub);margin-top:12px')}>{msg}</div> : null}
      </div>

      {/* real library stats */}
      <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px')}>
        {([
          [L('کلِ ویدیوها', 'Total videos'), faN(jobs.length), 'var(--tx)'],
          [L('آماده', 'Ready'), faN(done.length), 'var(--good)'],
          [L('در صف/پردازش', 'In progress'), faN(proc.length), 'var(--ai)'],
          [L('زمانِ کلِ ویدیو', 'Total footage'), `${faN(mins)} ${L('دقیقه', 'min')}`, 'var(--tx)'],
        ] as [string, string, string][]).map(([k, val, c], i) => (
          <div key={i} style={css(cardCss)}>
            <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>{k}</div>
            <div style={css(`font-size:24px;font-weight:800;color:${c}`)}>{val}</div>
          </div>
        ))}
      </div>

      {/* video grid */}
      {jobs.length === 0 ? (
        <div style={css(cardCss + ';text-align:center;color:var(--mut);font-size:12.5px;padding:26px')}>
          {L('هنوز ویدیویی نیست. یک ویدیو بکش‌ورها کن یا «آپلود ویدیو» را بزن.', 'No videos yet. Drag & drop or hit “Upload video”.')}
        </div>
      ) : (
        <div style={css('display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px')}>
          {jobs.map((j) => {
            const st = STATUS[j.status] || STATUS.queued
            const expanded = open === j.id
            const r = j.result
            const thumb = thumbs[j.id]
            return (
              <div key={j.id} style={css(`background:var(--card);border:1px solid ${expanded ? 'var(--bd2)' : 'var(--bd)'};border-radius:14px;overflow:hidden;grid-column:${expanded ? '1/-1' : 'auto'}`)}>
                {/* thumbnail / header */}
                <Box onClick={() => setOpen(expanded ? null : j.id)} css="cursor:pointer" hover="">
                  <div style={css('position:relative;aspect-ratio:16/9;background:#0a0c0f;display:flex;align-items:center;justify-content:center;overflow:hidden')}>
                    {thumb ? (
                      <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.92 }} />
                    ) : (
                      <div style={css('background:repeating-linear-gradient(125deg,#1b1f26,#1b1f26 10px,#191d23 10px,#191d23 20px);position:absolute;inset:0')}></div>
                    )}
                    <div style={css('position:absolute;width:46px;height:46px;border-radius:50%;background:rgba(13,15,18,.6);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.18)')}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <span style={css(`position:absolute;top:9px;inset-inline-start:9px;font-size:10px;font-weight:700;color:${st.c};background:rgba(13,15,18,.72);padding:3px 9px;border-radius:20px`)}>
                      {j.status === 'processing' ? <span style={css('display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--ai);margin-inline-end:5px;animation:nx-pulse 1.2s infinite')}></span> : null}
                      {fa ? st.fa : st.en}
                    </span>
                    {r?.players?.on_screen ? (
                      <span style={css('position:absolute;bottom:9px;inset-inline-end:9px;font-size:10px;font-weight:700;color:#fff;background:rgba(13,15,18,.72);padding:3px 9px;border-radius:20px')} title={L('بازیکنانِ هم‌زمان روی صحنه', 'players on screen at once')}>
                        {faN(r.players.on_screen)} {L('بازیکن', 'players')}
                      </span>
                    ) : null}
                  </div>
                </Box>
                {/* title row + actions */}
                <div style={css('padding:11px 13px;display:flex;align-items:center;gap:8px')}>
                  <div style={css('flex:1;min-width:0')}>
                    <div style={css('display:flex;align-items:center;gap:6px;min-width:0')}>
                      <span style={css('font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{j.name}</span>
                      <Box onClick={(e: React.MouseEvent) => onRename(e, j)} css="width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer;flex-shrink:0" hover="background:var(--card2);color:var(--ac)" title={L('تغییرِ عنوان', 'Rename')}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                      </Box>
                    </div>
                    <div style={css('font-size:10.5px;color:var(--mut);margin-top:2px')}>
                      {j.source === 'worker' ? L('پردازشِ محلی', 'local process') : L('آپلودِ سایت', 'site upload')}
                      {(j as any).source_type ? ` · ${srcLabel((j as any).source_type)}` : ''}
                    </div>
                  </div>
                  {(j as any).has_video && j.status !== 'queued' && j.status !== 'processing' ? (
                    <Box onClick={(e: React.MouseEvent) => onReprocess(e, j)} css="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer;flex-shrink:0" hover="background:var(--aid);color:var(--ai)" title={L('تحلیل مجدد', 'Re-analyze')}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></svg>
                    </Box>
                  ) : null}
                  <Box onClick={(e: React.MouseEvent) => onDelete(e, j)} css="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--mut);cursor:pointer;flex-shrink:0" hover="background:var(--dngd);color:var(--dng)" title={L('حذف ویدیو', 'Delete video')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></svg>
                  </Box>
                </div>

                {expanded && r ? (
                  <div style={css('padding:0 14px 16px;border-top:1px solid var(--bd)')}>
                    <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0')}>
                      {[
                        [L('بازیکنانِ هم‌زمان', 'Players on screen'), r.players?.on_screen],
                        [L('میانگینِ هر فریم', 'Avg/frame'), r.players?.avg],
                        [L('ردِ خام (ByteTrack)', 'Raw tracks'), r.players?.unique_tracks],
                        [L('تشخیص توپ', 'Ball detections'), r.ball?.detections],
                      ].map(([lab, val], i) => (
                        <div key={i} style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:11px 12px')}>
                          <div style={css('font-size:10.5px;color:var(--sub);margin-bottom:5px')}>{lab as string}</div>
                          <div style={css('font-size:19px;font-weight:800')}>{faN(val ?? 0)}</div>
                        </div>
                      ))}
                    </div>
                    {r.teams ? (
                      <div style={css('display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center')}>
                        {(r.single_team || (j as any).single_override ? r.teams.slice(0, 1) : r.teams).map((tm: any, ti: number) => (
                          <div key={ti} style={css('display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--bd);border-radius:9px;padding:8px 12px')}>
                            <span style={css(`width:13px;height:13px;border-radius:4px;background:${tm.color};border:1px solid rgba(255,255,255,.25)`)}></span>
                            <span style={css('font-size:12px;font-weight:700')}>{r.single_team || (j as any).single_override ? L('بازیکنان', 'Players') : `${L('تیم', 'Team')} ${ti === 0 ? 'A' : 'B'}`}</span>
                            <span style={css('font-size:11px;color:var(--mut)')}>{L('میانگین', 'avg')} {faN(tm.players_avg)} {L('بازیکن', 'players')}</span>
                          </div>
                        ))}
                        {!r.single_team ? (
                          <Box onClick={() => onToggleSingle(j)} css={`display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;padding:7px 11px;border-radius:9px;cursor:pointer;border:1px solid var(--bd2);background:${(j as any).single_override ? 'var(--aid)' : 'transparent'};color:${(j as any).single_override ? 'var(--ai)' : 'var(--mut)'}`} hover="border-color:var(--ai)" title={L('برای تمرین/تک‌تیم تیم A/B را ادغام کن', 'Merge A/B for a single-kit / training video')}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                            {L('تک‌تیم (تمرین)', 'Single team (training)')}
                          </Box>
                        ) : null}
                      </div>
                    ) : null}
                    {r.possession && r.teams && !r.single_team && !(j as any).single_override ? (
                      <div style={css('margin-bottom:14px')}>
                        <div style={css('display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;margin-bottom:6px')}>
                          <span style={css('color:var(--sub)')}>{L('مالکیتِ توپ', 'Ball possession')}</span>
                          <span style={css('color:var(--mut)')}>{L('تیم A', 'Team A')} {faN(r.possession.a)}٪ · {L('تیم B', 'Team B')} {faN(r.possession.b)}٪</span>
                        </div>
                        <div style={css('height:10px;border-radius:6px;overflow:hidden;display:flex')}>
                          <div style={css(`width:${r.possession.a}%;background:${r.teams[0].color}`)}></div>
                          <div style={css(`width:${r.possession.b}%;background:${r.teams[1].color}`)}></div>
                        </div>
                      </div>
                    ) : null}
                    {r.heatmap_a && r.heatmap_b && r.teams && !(j as any).single_override ? (
                      <div>
                        <div style={css('font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:8px')}>{L('نقشه‌ی حرارتیِ هر تیم (از ردیابی)', 'Per-team occupancy heatmap (from tracking)')}</div>
                        <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:12px')}>
                          <div>
                            <div style={css('font-size:10.5px;font-weight:700;margin-bottom:5px;display:flex;align-items:center;gap:6px')}><span style={css(`width:11px;height:11px;border-radius:3px;background:${r.teams[0].color};border:1px solid rgba(255,255,255,.25)`)}></span>{L('تیم A', 'Team A')}</div>
                            <Heatmap grid={r.heatmap_a} />
                          </div>
                          <div>
                            <div style={css('font-size:10.5px;font-weight:700;margin-bottom:5px;display:flex;align-items:center;gap:6px')}><span style={css(`width:11px;height:11px;border-radius:3px;background:${r.teams[1].color};border:1px solid rgba(255,255,255,.25)`)}></span>{L('تیم B', 'Team B')}</div>
                            <Heatmap grid={r.heatmap_b} />
                          </div>
                        </div>
                      </div>
                    ) : r.heatmap ? (
                      <div>
                        <div style={css('font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:8px')}>{L('نقشه‌ی حرارتیِ حضور بازیکنان (از ردیابی)', 'Player occupancy heatmap (from tracking)')}</div>
                        <Heatmap grid={r.heatmap} />
                      </div>
                    ) : null}
                    {r.video ? (
                      <div style={css('font-size:10.5px;color:var(--mut);margin-top:10px')}>
                        {faN(r.video.width)}×{faN(r.video.height)} · {faN(r.video.fps)}fps · {faN(r.processed_frames)} {L('فریمِ پردازش‌شده', 'frames processed')} · {r.model}
                      </div>
                    ) : null}
                    {r.physical ? <Physical v={v} job={j} /> : null}
                    {(j as any).calibratable ? (
                      <div style={css('margin-top:12px')}>
                        <button onClick={() => setCalib(calib === j.id ? null : j.id)} style={css('height:34px;padding:0 15px;background:var(--card2);border:1px solid var(--bd2);border-radius:9px;color:var(--ac);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px')}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>
                          {calib === j.id ? L('بستن کالیبراسیون', 'Close calibration') : r.calibration_auto ? L('کالیبراسیون دستی (اختیاری)', 'Manual calibration (optional)') : L('کالیبراسیون زمین', 'Field calibration')}
                        </button>
                        {calib === j.id ? <Calibration v={v} job={j} /> : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {expanded && j.status === 'failed' ? (
                  <div style={css('padding:12px 14px;border-top:1px solid var(--bd);font-size:11.5px;color:var(--dng)')}>{j.error}</div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
