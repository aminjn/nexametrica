// Admin client for Super-Admin-managed settings (LLM provider/key/model).
// The admin token is held in localStorage and sent as X-Admin-Token; it must
// match ADMIN_TOKEN on the server. The LLM key itself is never returned to the
// browser — the API only reports whether a key is set and its last 4 chars.
const BASE = (import.meta.env.VITE_API_BASE as string | undefined) || '/api'
const TOKEN_KEY = 'nx_admin_token'

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY) || ''
export const setAdminToken = (t: string) => localStorage.setItem(TOKEN_KEY, t)

function headers() {
  return { 'Content-Type': 'application/json', 'X-Admin-Token': getAdminToken() }
}

export type LlmConfig = {
  base_url: string
  model: string
  temperature: number
  key_set: boolean
  key_last4: string
}

export async function getLlmConfig(): Promise<LlmConfig> {
  const r = await fetch(`${BASE}/admin/llm-config`, { headers: headers() })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

export async function saveLlmConfig(body: {
  base_url?: string
  model?: string
  temperature?: number
  api_key?: string
}): Promise<{ ok: boolean }> {
  const r = await fetch(`${BASE}/admin/llm-config`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

export async function testLlm(): Promise<{ ok: boolean; sample?: string; detail?: string }> {
  const r = await fetch(`${BASE}/admin/llm-test`, { method: 'POST', headers: headers() })
  if (r.status === 401 || r.status === 503) throw new Error(String(r.status))
  return r.json()
}
