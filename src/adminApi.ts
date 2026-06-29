// Admin client for the Super-Admin AI console (providers + agents).
// Auth is disabled for now (no token) — the project will be secured later.
// Provider API keys are write-only; the API only ever reports key_set + last4.
const BASE = (import.meta.env.VITE_API_BASE as string | undefined) || '/api'

function headers() {
  return { 'Content-Type': 'application/json' }
}

async function jget<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { headers: headers() })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}
async function jsend<T>(method: string, path: string, body?: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!r.ok && (r.status === 401 || r.status === 503)) throw new Error(String(r.status))
  return r.json()
}

export type Provider = {
  id: string
  name: string
  call: string
  base_url: string
  models: string[]
  key_set: boolean
  key_last4: string
}

export type Agent = {
  id: string
  group: string
  group_en: string
  kind: string
  runtime: string
  name: string
  name_en: string
  hint: string
  provider_id: string
  provider_name: string
  model: string
  loaded_at: number
}

export const listProviders = () => jget<{ providers: Provider[] }>('/admin/providers')
export const upsertProvider = (p: {
  id?: string
  name: string
  call: string
  base_url: string
  api_key?: string
  models?: string[]
}) => jsend<{ ok: boolean; id: string }>('POST', '/admin/providers', p)
// POST (not DELETE): ArvanCloud CDN times out the DELETE method.
export const deleteProvider = (id: string) => jsend<{ ok: boolean }>('POST', `/admin/providers/${id}/delete`)
export const getProviderModels = (id: string) => jget<{ models: string[] }>(`/admin/providers/${id}/models`)
export const testProvider = (id: string) =>
  jsend<{ ok: boolean; sample?: string; detail?: string; model?: string }>('POST', `/admin/providers/${id}/test`)

export const listAgents = () =>
  jget<{ agents: Agent[]; providers: { id: string; name: string; call: string }[] }>('/admin/agents')
export const assignAgent = (id: string, provider_id: string, model: string) =>
  jsend<{ ok: boolean }>('PUT', `/admin/agents/${id}`, { provider_id, model })
export const loadAgent = (id: string, ts: number) =>
  jsend<{ ok: boolean; loaded_at?: number; detail?: string }>('POST', `/admin/agents/${id}/load?ts=${ts}`)
