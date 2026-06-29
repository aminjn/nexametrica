import { useEffect, useState } from 'react'
import { Box } from '../components/Box'
import { css } from '../lib/css'
import { AdminAiConfig } from '../components/AdminAiConfig'
import type { PageProps } from './types'
import { listJobs, type Job } from '../api'
import { eng } from '../engine'

// Real super-admin panel: a live platform overview (computed from real jobs) and
// the real AI providers/agents console. The fake billing / SMS / ML-training /
// revenue tabs were removed — they had no backend.
export function Sysadmin({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  const faN = (s: any) => (eng as any).faN(s)
  const [tab, setTab] = useState<'overview' | 'ai'>('overview')
  const [jobs, setJobs] = useState<Job[]>([])
  const [apiUp, setApiUp] = useState<boolean | null>(null)
  useEffect(() => {
    listJobs().then((r) => { setJobs(r.jobs || []); setApiUp(true) }).catch(() => setApiUp(false))
  }, [])

  const done = jobs.filter((j) => j.status === 'done')
  const processing = jobs.filter((j) => j.status === 'processing' || j.status === 'queued')
  const errored = jobs.filter((j) => j.status === 'error')
  const totalFrames = done.reduce((s, j) => s + ((j as any).result?.processed_frames || 0), 0)

  const TABS: [string, string, string][] = [
    ['overview', L('نمای کلی', 'Overview'), 'M3 3v18h18M7 14l4-4 3 3 5-6'],
    ['ai', L('ارائه‌دهنده‌ها و ایجنت‌های AI', 'AI providers & agents'), 'M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z'],
  ]

  return (
    <div style={css('max-width:1320px;margin:0 auto;display:grid;grid-template-columns:230px 1fr;gap:16px')}>
      <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:8px;height:fit-content')}>
        <div style={css('display:flex;align-items:center;gap:9px;padding:10px 11px 12px')}>
          <span style={css('width:30px;height:30px;border-radius:9px;background:rgba(244,63,94,.14);display:flex;align-items:center;justify-content:center')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.9"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" /></svg>
          </span>
          <div style={css('font-size:12.5px;font-weight:800;color:#f43f5e')}>{L('مدیریتِ ارشد', 'Super admin')}</div>
        </div>
        {TABS.map(([key, label, ic]) => {
          const on = tab === key
          return (
            <Box key={key} as="button" onClick={() => setTab(key as any)}
              css={`width:100%;display:flex;align-items:center;gap:10px;padding:9px 11px;margin-bottom:2px;border:none;border-radius:9px;background:${on ? 'var(--acd)' : 'transparent'};color:${on ? 'var(--ac)' : 'var(--sub)'};font-family:inherit;font-size:12.5px;font-weight:${on ? 700 : 600};cursor:pointer;text-align:start`}
              hover="background:var(--bg2)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={css('flex-shrink:0')}><path d={ic} /></svg>
              {label}
            </Box>
          )
        })}
      </div>

      <div>
        {tab === 'overview' ? (
          <>
            <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap')}>
              <span style={css('background:var(--aid);color:var(--ai);font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:20px')}>{L('داده‌ی واقعی', 'Real data')}</span>
              <div style={css('font-weight:800;font-size:15px')}>{L('نمای کلیِ پلتفرم', 'Platform overview')}</div>
            </div>
            <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px')}>
              {([
                [L('کلِ ویدیوها', 'Total videos'), faN(jobs.length)],
                [L('آنالیزِ موفق', 'Completed'), faN(done.length)],
                [L('در صف/پردازش', 'In progress'), faN(processing.length)],
                [L('فریمِ پردازش‌شده', 'Frames processed'), faN(totalFrames.toLocaleString('en-US'))],
              ] as [string, string][]).map(([k, val], i) => (
                <div key={i} style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 17px')}>
                  <div style={css('font-size:11.5px;color:var(--sub);margin-bottom:9px')}>{k}</div>
                  <div style={css('font-size:24px;font-weight:800')}>{val}</div>
                </div>
              ))}
            </div>
            <div style={css('background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px')}>
              <div style={css('font-weight:700;font-size:14px;margin-bottom:14px')}>{L('وضعیتِ سرویس‌ها', 'Service status')}</div>
              <div style={css('display:flex;flex-direction:column;gap:8px')}>
                {([
                  [L('API و صفِ کارها', 'API & job queue'), apiUp === null ? ['var(--mut)', L('بررسی…', 'checking…')] : apiUp ? ['var(--good)', L('آنلاین', 'online')] : ['var(--dng)', L('قطع', 'offline')]],
                  [L('کارگرِ بینایی (GPU)', 'Vision worker (GPU)'), processing.length ? ['var(--ai)', L('در حال پردازش', 'processing')] : done.length ? ['var(--good)', L('آماده', 'ready')] : ['var(--mut)', L('بدون کار', 'no jobs yet')]],
                  [L('خطاها', 'Errors'), errored.length ? ['var(--dng)', `${faN(errored.length)} ${L('کار', 'jobs')}`] : ['var(--good)', L('بدون خطا', 'none')]],
                ] as [string, string[]][]).map(([label, st], i) => (
                  <div key={i} style={css('display:flex;align-items:center;gap:12px;padding:11px 13px;background:var(--bg2);border-radius:10px')}>
                    <span style={css(`width:8px;height:8px;border-radius:50%;background:${st[0]};flex-shrink:0`)}></span>
                    <span style={css('flex:1;font-size:12.5px;font-weight:600')}>{label}</span>
                    <span style={css(`font-family:monospace;font-size:11.5px;font-weight:700;color:${st[0]}`)}>{st[1]}</span>
                  </div>
                ))}
              </div>
              <div style={css('font-size:10.5px;color:var(--mut);line-height:1.7;margin-top:12px')}>
                {L('برای پیکربندیِ ارائه‌دهنده‌های هوشِ مصنوعی و ایجنت‌ها، تبِ «ارائه‌دهنده‌ها و ایجنت‌های AI» را باز کن.',
                  'Open the “AI providers & agents” tab to configure AI providers and agents.')}
              </div>
            </div>
          </>
        ) : (
          <AdminAiConfig v={v} />
        )}
      </div>
    </div>
  )
}
