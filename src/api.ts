// Thin client for the Nexa Metrica backend API.
// Same-origin by default ('/api', proxied by nginx to uvicorn). Override with
// VITE_API_BASE for local dev against a remote backend.
const BASE = (import.meta.env.VITE_API_BASE as string | undefined) || '/api'

export type ChatMsg = { role: string; text: string }

export async function assistantChat(
  message: string,
  history: ChatMsg[],
  persona: unknown,
  lang: string,
): Promise<string> {
  const r = await fetch(`${BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, persona, lang }),
  })
  if (!r.ok) throw new Error(`assistant/chat ${r.status}`)
  const d = (await r.json()) as { text: string }
  return d.text
}

export type Job = {
  id: string
  name: string
  status: string
  source: string
  created: number
  result: any
  error?: string
}

export async function uploadVideo(file: File): Promise<Job> {
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch(`${BASE}/videos`, { method: 'POST', body: fd })
  if (!r.ok) throw new Error(`upload ${r.status}`)
  return r.json()
}

export async function listJobs(): Promise<{ jobs: Job[] }> {
  const r = await fetch(`${BASE}/jobs`)
  if (!r.ok) throw new Error(`jobs ${r.status}`)
  return r.json()
}

export async function getJob(id: string): Promise<Job> {
  const r = await fetch(`${BASE}/jobs/${id}`)
  if (!r.ok) throw new Error(`job ${r.status}`)
  return r.json()
}

export async function deleteJob(id: string): Promise<{ ok: boolean }> {
  // POST (not HTTP DELETE): the ArvanCloud CDN times out the DELETE method.
  const r = await fetch(`${BASE}/jobs/${id}/delete`, { method: 'POST' })
  if (!r.ok) throw new Error(`delete ${r.status}`)
  return r.json()
}

// generic manual-entry collections (roster, schedule, training, …)
export async function getData<T>(key: string): Promise<T | null> {
  const r = await fetch(`${BASE}/data/${key}`)
  if (!r.ok) throw new Error(`data ${r.status}`)
  return (await r.json()).value ?? null
}
export async function saveData(key: string, value: unknown): Promise<{ ok: boolean }> {
  const r = await fetch(`${BASE}/data/${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  })
  if (!r.ok) throw new Error(`data ${r.status}`)
  return r.json()
}

export async function renameJob(id: string, name: string): Promise<{ ok: boolean }> {
  const r = await fetch(`${BASE}/jobs/${id}/rename`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!r.ok) throw new Error(`rename ${r.status}`)
  return r.json()
}

export async function setSingleTeam(id: string, single: boolean): Promise<{ ok: boolean }> {
  const r = await fetch(`${BASE}/jobs/${id}/single`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ single }),
  })
  if (!r.ok) throw new Error(`single ${r.status}`)
  return r.json()
}

export async function reprocessJob(id: string): Promise<{ ok: boolean }> {
  const r = await fetch(`${BASE}/jobs/${id}/reprocess`, { method: 'POST' })
  if (!r.ok) throw new Error(`reprocess ${r.status}`)
  return r.json()
}

export async function saveCalibration(jobId: string, corners: number[][]): Promise<{ ok: boolean }> {
  const r = await fetch(`${BASE}/jobs/${jobId}/calibration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ corners }),
  })
  if (!r.ok) throw new Error(`calibration ${r.status}`)
  return r.json()
}

export async function generateReport(context: unknown, lang: string): Promise<string> {
  const r = await fetch(`${BASE}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, lang }),
  })
  if (!r.ok) throw new Error(`report ${r.status}`)
  const d = (await r.json()) as { text: string }
  return d.text
}
