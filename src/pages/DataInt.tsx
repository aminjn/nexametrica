import { useEffect, useState } from 'react'
import { css } from '../lib/css'
import type { PageProps } from './types'
import { listJobs, type Job } from '../api'
import { useLatestPhysicalJob } from '../lib/useLatestJob'
import { downloadText } from '../lib/download'

// Real — live status of the actual backend services and a working data export.
// The Python snippet loads the file you export here. No mock.
export function DataInt({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const [api, setApi] = useState<'checking' | 'up' | 'down'>('checking')
  const [worker, setWorker] = useState<'idle' | 'active' | 'none'>('none')
  const job = useLatestPhysicalJob()

  useEffect(() => {
    listJobs()
      .then((r: { jobs: Job[] }) => {
        setApi('up')
        const anyProcessing = r.jobs.some((j) => j.status === 'processing' || j.status === 'queued')
        const anyDone = r.jobs.some((j) => j.status === 'done')
        setWorker(anyProcessing ? 'active' : anyDone ? 'idle' : 'none')
      })
      .catch(() => setApi('down'))
  }, [])

  const conns = [
    {
      n: L('API نکسامتریکا', 'Nexa Metrica API'),
      d: L('سرورِ صف و داده', 'job queue & data server'),
      ...(api === 'up'
        ? { sc: 'var(--good)', sb: 'rgba(74,222,128,.13)', label: L('آنلاین', 'online') }
        : api === 'down'
          ? { sc: 'var(--dng)', sb: 'var(--dngd)', label: L('قطع', 'offline') }
          : { sc: 'var(--mut)', sb: 'var(--bg2)', label: L('بررسی…', 'checking…') }),
    },
    {
      n: L('کارگرِ بینایی (Z440 / GPU)', 'Vision worker (Z440 / GPU)'),
      d: L('YOLO + ByteTrack — محلی', 'YOLO + ByteTrack — local'),
      ...(worker === 'active'
        ? { sc: 'var(--ai)', sb: 'var(--aid)', label: L('در حال پردازش', 'processing') }
        : worker === 'idle'
          ? { sc: 'var(--good)', sb: 'rgba(74,222,128,.13)', label: L('آماده', 'ready') }
          : { sc: 'var(--mut)', sb: 'var(--bg2)', label: L('بدون کار', 'no jobs yet') }),
    },
    {
      n: L('پایگاهِ روستر', 'Roster store'),
      d: L('داده‌ی تیمِ تو', 'your team data'),
      sc: 'var(--good)', sb: 'rgba(74,222,128,.13)', label: L('محلی', 'local'),
    },
  ]

  function exportFull() {
    downloadText(`${(job as any)?.name || 'analysis'}-full.json`, JSON.stringify((job as any)?.result ?? {}, null, 2), 'application/json')
  }

  const snippet = `import json

# فایلی که از همین صفحه دانلود کردی
with open("${(job as any)?.name || 'analysis'}-full.json", encoding="utf-8") as f:
    data = json.load(f)

for p in data["physical"]["players"]:
    print(p["player"], p.get("number"), p["distance_m"], "m",
          p["max_speed_kmh"], "km/h")`

  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
        <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
        <div style={css('font-weight:800;font-size:15px')}>{L('ادغام و خروجیِ داده', 'Integrations & data export')}</div>
      </div>

      {/* real service status */}
      <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px')}>
        {conns.map((c, i) => (
          <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
            <div style={css('font-weight:700;font-size:14px;margin-bottom:3px')}>{c.n}</div>
            <div style={css('font-size:11.5px;color:var(--mut);line-height:1.5;margin-bottom:14px')}>{c.d}</div>
            <span style={css(`display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:${c.sc};background:${c.sb};padding:4px 11px;border-radius:20px`)}>
              <span style={css(`width:6px;height:6px;border-radius:50%;background:${c.sc}`)}></span>{c.label}
            </span>
          </div>
        ))}
      </div>

      {/* real export + snippet */}
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px')}>
        <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap')}>
          <div style={css('font-weight:700;font-size:14px')}>{L('خروجیِ کاملِ آنالیز + کدِ بارگذاری', 'Full export + loader code')}</div>
          <span style={css('font-size:11px;color:var(--mut);font-family:monospace')}>Python</span>
          <div style={css('flex:1')}></div>
          <button onClick={exportFull} disabled={!job} style={css(`height:34px;padding:0 16px;background:${job ? 'var(--ac)' : 'var(--card)'};border:none;border-radius:9px;color:${job ? '#0d0f12' : 'var(--mut)'};font-family:inherit;font-size:12.5px;font-weight:800;cursor:${job ? 'pointer' : 'default'}`)}>
            {job ? L('دانلودِ JSON', 'Download JSON') : L('اول آنالیز کن', 'Analyse first')}
          </button>
        </div>
        <div style={css('background:#0a0c0f;border:1px solid var(--bd);border-radius:11px;padding:16px 18px;font-family:monospace;font-size:12.5px;line-height:1.9;color:#cdd2d8;white-space:pre;overflow-x:auto')}>{snippet}</div>
      </div>
    </div>
  )
}
