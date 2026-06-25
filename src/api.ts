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
