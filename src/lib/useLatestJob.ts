// Fetch the most recent completed CV job that has real physical analytics, and
// return the full job (with heatmaps). Used to feed real data into the analysis
// pages instead of mock. Returns null until loaded / if none exists.
import { useEffect, useState } from 'react'
import { listJobs, getJob, type Job } from '../api'

export function useLatestPhysicalJob(): Job | null {
  const [job, setJob] = useState<Job | null>(null)
  useEffect(() => {
    let alive = true
    listJobs()
      .then(async (r) => {
        const done = r.jobs.filter((j) => j.status === 'done' && (j as any).result)
        const pick =
          done.find((j) => (j as any).result?.physical?.player_count) ||
          done.find((j) => (j as any).result?.calibration_auto) ||
          done[0]
        if (!pick) return
        const full = await getJob(pick.id)
        if (alive) setJob(full)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  return job
}
