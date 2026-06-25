// Super-Admin AI console: a top admin-token strip (not a blocking gate), then
// two always-visible sections — (1) API providers (links/keys, test, manual
// models) and (2) the complete agents list, where picking a provider lists its
// models ALPHABETICALLY and each agent has a Load button + status.
import { useEffect, useState } from 'react'
import { css } from '../lib/css'
import { Box } from './Box'
import {
  getAdminToken,
  setAdminToken,
  listProviders,
  upsertProvider,
  deleteProvider,
  getProviderModels,
  testProvider,
  listAgents,
  assignAgent,
  loadAgent,
  type Provider,
  type Agent,
} from '../adminApi'

const CARD = 'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px;margin-bottom:14px'
const LBL = 'font-size:11px;font-weight:700;color:var(--sub);margin-bottom:6px'
const INP =
  'width:100%;height:38px;background:var(--bg2);border:1px solid var(--bd2);border-radius:9px;color:var(--tx);font-family:inherit;font-size:12.5px;padding:0 11px;outline:none'
const RUNTIME: Record<string, { fa: string; en: string; c: string }> = {
  api: { fa: 'ابری (API)', en: 'Cloud API', c: 'var(--ai)' },
  self: { fa: 'میزبانی شخصی (GPU)', en: 'Self-hosted GPU', c: 'var(--ac)' },
  cpu: { fa: 'محلی (CPU)', en: 'Local CPU', c: 'var(--warn)' },
}

export function AdminAiConfig({ v }: { v: Record<string, any> }) {
  const fa = v.lang === 'fa'
  const L = (f: string, e: string) => (fa ? f : e)

  const [connected, setConnected] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [agentProvs, setAgentProvs] = useState<{ id: string; name: string }[]>([])
  const [models, setModels] = useState<Record<string, string[]>>({})
  const [msg, setMsg] = useState<{ k: 'ok' | 'err' | 'info'; t: string } | null>(null)
  const [draft, setDraft] = useState<Record<string, any>>({})

  async function loadAll() {
    try {
      const pp = await listProviders()
      const aa = await listAgents()
      setProviders(pp.providers)
      setAgents(aa.agents)
      setAgentProvs(aa.providers)
      setConnected(true)
      setMsg(null)
      const used = new Set(aa.agents.map((a) => a.provider_id).filter(Boolean))
      for (const pid of used) ensureModels(pid)
    } catch (err) {
      const code = String((err as Error).message)
      setConnected(false)
      setMsg({
        k: 'err',
        t:
          code === '503'
            ? L('ADMIN_TOKEN روی سرور تنظیم نشده.', 'ADMIN_TOKEN not set on the server.')
            : code === '401'
              ? L('توکن ادمین نامعتبر است.', 'Invalid admin token.')
              : L('اتصال به سرور برقرار نشد (API بالا هست؟).', 'Could not reach the server (is the API up?).'),
      })
    }
  }

  async function ensureModels(pid: string) {
    if (!pid || models[pid]) return
    try {
      const r = await getProviderModels(pid)
      setModels((m) => ({ ...m, [pid]: r.models }))
    } catch {
      setModels((m) => ({ ...m, [pid]: [] }))
    }
  }

  useEffect(() => {
    if (getAdminToken()) loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function connect() {
    const t = tokenInput.trim()
    if (t) setAdminToken(t)
    setTokenInput('')
    setMsg({ k: 'info', t: L('در حال اتصال…', 'Connecting…') })
    loadAll()
  }
  function disconnect() {
    setAdminToken('')
    setConnected(false)
    setProviders([])
    setAgents([])
    setMsg(null)
  }

  // ---------- providers ----------
  function d(p: Provider, k: string, fallback: any) {
    const dd = draft[p.id] || {}
    return dd[k] !== undefined ? dd[k] : fallback
  }
  function setD(id: string, k: string, val: any) {
    setDraft((s) => ({ ...s, [id]: { ...(s[id] || {}), [k]: val } }))
  }
  async function saveProvider(p: Provider) {
    const dd = draft[p.id] || {}
    try {
      await upsertProvider({
        id: p.id,
        name: dd.name ?? p.name,
        call: dd.call ?? p.call,
        base_url: dd.base_url ?? p.base_url,
        api_key: dd.api_key || undefined,
        models:
          dd.models !== undefined
            ? String(dd.models).split(',').map((x) => x.trim()).filter(Boolean)
            : p.models,
      })
      setDraft((s) => ({ ...s, [p.id]: {} }))
      setModels((m) => ({ ...m, [p.id]: [] }))
      await loadAll()
      setMsg({ k: 'ok', t: L('سرویس‌دهنده ذخیره شد.', 'Provider saved.') })
    } catch {
      setMsg({ k: 'err', t: L('ذخیره نشد.', 'Save failed.') })
    }
  }
  async function onTestProvider(id: string) {
    setMsg({ k: 'info', t: L('در حال تست…', 'Testing…') })
    try {
      const r = await testProvider(id)
      setMsg(
        r.ok
          ? { k: 'ok', t: L('اتصال موفق ✓ ', 'OK ✓ ') + (r.model || '') + ' ' + (r.sample || '') }
          : { k: 'err', t: L('ناموفق: ', 'Failed: ') + (r.detail || '') },
      )
    } catch {
      setMsg({ k: 'err', t: L('خطا (توکن ادمین؟).', 'Error (admin token?).') })
    }
  }
  async function addProvider() {
    try {
      await upsertProvider({ name: L('سرویس‌دهنده جدید', 'New provider'), call: 'openai', base_url: 'https://' })
      await loadAll()
    } catch {
      setMsg({ k: 'err', t: L('افزودن نشد.', 'Add failed.') })
    }
  }
  async function removeProvider(id: string) {
    try {
      await deleteProvider(id)
      await loadAll()
    } catch {
      setMsg({ k: 'err', t: L('حذف نشد.', 'Delete failed.') })
    }
  }

  // ---------- agents ----------
  function patchAgent(id: string, patch: Partial<Agent>) {
    setAgents((as) => as.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }
  async function onProviderPick(a: Agent, pid: string) {
    patchAgent(a.id, { provider_id: pid, model: '', loaded_at: 0 })
    await ensureModels(pid)
  }
  async function onModelPick(a: Agent, model: string) {
    patchAgent(a.id, { model, loaded_at: 0 })
    try {
      await assignAgent(a.id, a.provider_id, model)
    } catch {
      setMsg({ k: 'err', t: L('ذخیره‌ی انتساب نشد.', 'Assignment save failed.') })
    }
  }
  async function onLoad(a: Agent) {
    if (!a.provider_id || !a.model) {
      setMsg({ k: 'err', t: L('اول سرویس‌دهنده و مدل را انتخاب کن.', 'Pick provider & model first.') })
      return
    }
    setMsg({ k: 'info', t: L('در حال لود…', 'Loading…') })
    const ts = Math.floor(Date.now() / 1000)
    try {
      const r = await loadAgent(a.id, ts)
      if (r.ok) {
        patchAgent(a.id, { loaded_at: r.loaded_at || ts })
        setMsg({ k: 'ok', t: L('مدل لود شد ✓', 'Model loaded ✓') })
      } else {
        setMsg({ k: 'err', t: L('لود نشد: ', 'Load failed: ') + (r.detail || '') })
      }
    } catch {
      setMsg({ k: 'err', t: L('خطا در لود.', 'Load error.') })
    }
  }

  const banner = msg ? (
    <div
      style={css(
        'margin-bottom:14px;padding:10px 13px;border-radius:10px;font-size:12px;font-weight:600;' +
          (msg.k === 'ok'
            ? 'background:rgba(74,222,128,.12);color:var(--good);border:1px solid rgba(74,222,128,.3)'
            : msg.k === 'err'
              ? 'background:var(--dngd);color:var(--dng);border:1px solid rgba(239,68,68,.3)'
              : 'background:var(--aid);color:var(--ai);border:1px solid rgba(56,189,248,.3)'),
      )}
    >
      {msg.t}
    </div>
  ) : null

  const groups = Array.from(new Set(agents.map((a) => (fa ? a.group : a.group_en))))

  return (
    <div>
      {/* ---------- token strip (always visible, not a blocker) ---------- */}
      <div style={css(CARD + ';display:flex;align-items:center;gap:14px;flex-wrap:wrap')}>
        <div style={css('display:flex;align-items:center;gap:8px')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ai)">
            <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
          </svg>
          <div style={css('font-weight:800;font-size:15px')}>{L('کنسول هوش مصنوعی', 'AI console')}</div>
          <span
            style={css(
              'display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;' +
                (connected
                  ? 'background:rgba(74,222,128,.13);color:var(--good)'
                  : 'background:var(--raised);color:var(--mut)'),
            )}
          >
            <span style={css(`width:7px;height:7px;border-radius:50%;background:${connected ? 'var(--good)' : 'var(--mut)'}`)}></span>
            {connected ? L('متصل', 'Connected') : L('قفل', 'Locked')}
          </span>
        </div>
        <div style={css('flex:1')}></div>
        {connected ? (
          <button
            onClick={disconnect}
            style={css(
              'height:38px;padding:0 14px;background:none;border:1px solid var(--bd2);border-radius:9px;color:var(--mut);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
            )}
          >
            {L('قطع اتصال', 'Disconnect')}
          </button>
        ) : (
          <div style={css('display:flex;gap:10px;align-items:center;min-width:340px;flex:1')}>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') connect()
              }}
              placeholder={L('توکن ادمین (که اسکریپت سرور چاپ کرد)', 'Admin token (printed by the server script)')}
              style={css(INP + ';flex:1;height:40px')}
            />
            <button
              onClick={connect}
              style={css(
                'height:40px;padding:0 20px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer;flex-shrink:0',
              )}
            >
              {L('اتصال', 'Connect')}
            </button>
          </div>
        )}
      </div>

      {banner}

      {/* ---------- 1) providers ---------- */}
      <div style={css(CARD)}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:4px')}>
          <div style={css('font-weight:800;font-size:14.5px')}>{L('۱ · سرویس‌دهنده‌های API', '1 · API providers')}</div>
          <div style={css('flex:1')}></div>
          {connected ? (
            <button
              onClick={addProvider}
              style={css(
                'height:32px;padding:0 14px;background:var(--card2);border:1px dashed var(--bd2);border-radius:9px;color:var(--sub);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer',
              )}
            >
              {L('+ سرویس‌دهنده', '+ Provider')}
            </button>
          ) : null}
        </div>
        <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:14px')}>
          {L('توکن، لینک API و کلید هر سرویس‌دهنده اینجاست. کلیدها فقط روی سرور می‌مانند.', 'Token, API URL and key per provider. Keys stay server-side.')}
        </div>
        {!connected ? (
          <div style={css('font-size:12.5px;color:var(--mut);padding:10px 0')}>
            {L('برای نمایش، اول توکن ادمین را بالا وارد کن.', 'Enter the admin token above to view.')}
          </div>
        ) : (
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:12px')}>
            {providers.map((p) => (
              <div key={p.id} style={css('background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:14px')}>
                <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:10px')}>
                  <input
                    value={d(p, 'name', p.name)}
                    onChange={(e) => setD(p.id, 'name', (e.target as HTMLInputElement).value)}
                    style={css(INP + ';font-weight:700;height:34px')}
                  />
                  <span
                    style={css(
                      'font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap;' +
                        (p.key_set ? 'background:rgba(74,222,128,.13);color:var(--good)' : 'background:var(--raised);color:var(--mut)'),
                    )}
                  >
                    {p.key_set ? `••••${p.key_last4}` : L('بدون کلید', 'no key')}
                  </span>
                </div>
                <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px')}>
                  <div>
                    <div style={css(LBL)}>{L('نوع', 'Type')}</div>
                    <select
                      value={d(p, 'call', p.call)}
                      onChange={(e) => setD(p.id, 'call', (e.target as HTMLSelectElement).value)}
                      style={css(INP + ';cursor:pointer')}
                    >
                      <option value="openai">OpenAI-compatible</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="selfhosted">Self-hosted</option>
                    </select>
                  </div>
                  <div>
                    <div style={css(LBL)}>{L('کلید API', 'API key')}</div>
                    <input
                      type="password"
                      value={d(p, 'api_key', '')}
                      onChange={(e) => setD(p.id, 'api_key', (e.target as HTMLInputElement).value)}
                      placeholder={p.key_set ? '••••••••' : L('کلید', 'key')}
                      style={css(INP)}
                    />
                  </div>
                </div>
                <div style={css('margin-bottom:8px')}>
                  <div style={css(LBL)}>Endpoint (API URL)</div>
                  <input
                    value={d(p, 'base_url', p.base_url)}
                    onChange={(e) => setD(p.id, 'base_url', (e.target as HTMLInputElement).value)}
                    style={css(INP + ';font-family:monospace;font-size:11px')}
                  />
                </div>
                <div style={css('margin-bottom:10px')}>
                  <div style={css(LBL)}>
                    {L('مدل‌ها (دستی، با کاما)', 'Models (manual, comma)')}{' '}
                    <span style={css('color:var(--mut);font-weight:500')}>
                      {p.call === 'openai' ? L('— برای OpenAI خودکار', '— auto for OpenAI') : ''}
                    </span>
                  </div>
                  <input
                    value={d(p, 'models', (p.models || []).join(', '))}
                    onChange={(e) => setD(p.id, 'models', (e.target as HTMLInputElement).value)}
                    placeholder="claude-opus-4-1, gemini-2.5-pro"
                    style={css(INP + ';font-family:monospace;font-size:11px')}
                  />
                </div>
                <div style={css('display:flex;gap:8px')}>
                  <button
                    onClick={() => saveProvider(p)}
                    style={css('height:32px;padding:0 14px;background:var(--ac);border:none;border-radius:8px;color:#0d0f12;font-family:inherit;font-size:11.5px;font-weight:800;cursor:pointer')}
                  >
                    {L('ذخیره', 'Save')}
                  </button>
                  <button
                    onClick={() => onTestProvider(p.id)}
                    style={css('height:32px;padding:0 12px;background:var(--card);border:1px solid var(--bd2);border-radius:8px;color:var(--tx);font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer')}
                  >
                    {L('تست', 'Test')}
                  </button>
                  <div style={css('flex:1')}></div>
                  <button
                    onClick={() => removeProvider(p.id)}
                    style={css('height:32px;padding:0 12px;background:none;border:1px solid var(--bd);border-radius:8px;color:var(--dng);font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer')}
                  >
                    {L('حذف', 'Delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- 2) agents ---------- */}
      <div style={css(CARD)}>
        <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:4px')}>
          <div style={css('font-weight:800;font-size:14.5px')}>{L('۲ · ایجنت‌های پروژه', '2 · Project agents')}</div>
          {connected ? (
            <span style={css('font-size:11px;color:var(--mut)')}>
              {agents.length} {L('کار', 'tasks')}
            </span>
          ) : null}
        </div>
        <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:14px')}>
          {L('برای هر کار: اول سرویس‌دهنده، بعد مدل (الفبایی) را انتخاب کن و «لود مدل» را بزن.', 'For each task: pick a provider, then a model (alphabetical), then “Load model”.')}
        </div>
        {!connected ? (
          <div style={css('font-size:12.5px;color:var(--mut);padding:10px 0')}>
            {L('برای نمایش، اول توکن ادمین را بالا وارد کن.', 'Enter the admin token above to view.')}
          </div>
        ) : (
          groups.map((g) => (
            <div key={g} style={css('margin-bottom:18px')}>
              <div style={css('font-size:11px;font-weight:800;color:var(--mut);letter-spacing:.5px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--bd)')}>
                {g}
              </div>
              <div style={css('display:flex;flex-direction:column;gap:8px')}>
                {agents
                  .filter((a) => (fa ? a.group : a.group_en) === g)
                  .map((a) => {
                    const rt = RUNTIME[a.runtime] || RUNTIME.api
                    const opts = (models[a.provider_id] || []).slice()
                    return (
                      <div
                        key={a.id}
                        style={css('display:grid;grid-template-columns:1.4fr 1fr 1.2fr auto auto;gap:10px;align-items:center;background:var(--bg2);border:1px solid var(--bd);border-radius:11px;padding:11px 13px')}
                      >
                        <div style={css('min-width:0')}>
                          <div style={css('font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>
                            {fa ? a.name : a.name_en}
                          </div>
                          <div style={css('display:flex;align-items:center;gap:7px;margin-top:3px')}>
                            <span style={css(`font-size:9.5px;font-weight:700;color:${rt.c}`)}>{fa ? rt.fa : rt.en}</span>
                            <span style={css('font-size:10px;color:var(--mut);font-family:monospace')}>{a.hint}</span>
                          </div>
                        </div>
                        <select
                          value={a.provider_id}
                          onChange={(e) => onProviderPick(a, (e.target as HTMLSelectElement).value)}
                          style={css(INP + ';cursor:pointer')}
                        >
                          <option value="">{L('سرویس‌دهنده…', 'Provider…')}</option>
                          {agentProvs.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={a.model}
                          onChange={(e) => onModelPick(a, (e.target as HTMLSelectElement).value)}
                          disabled={!a.provider_id}
                          style={css(INP + ';cursor:pointer;font-family:monospace;font-size:11px')}
                        >
                          <option value="">
                            {!a.provider_id
                              ? L('اول سرویس‌دهنده', 'pick provider')
                              : opts.length
                                ? L('مدل…', 'model…')
                                : L('مدلی یافت نشد', 'no models')}
                          </option>
                          {opts.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <span
                          style={css(
                            'font-size:10px;font-weight:700;padding:4px 9px;border-radius:20px;white-space:nowrap;' +
                              (a.loaded_at ? 'background:rgba(74,222,128,.13);color:var(--good)' : 'background:var(--raised);color:var(--mut)'),
                          )}
                        >
                          {a.loaded_at ? L('لود شده', 'loaded') : L('لود نشده', 'not loaded')}
                        </span>
                        <Box
                          as="button"
                          onClick={() => onLoad(a)}
                          css="height:32px;padding:0 13px;background:var(--acd);border:1px solid rgba(163,230,53,.35);border-radius:8px;color:var(--ac);font-family:inherit;font-size:11.5px;font-weight:800;cursor:pointer;white-space:nowrap"
                          hover="filter:brightness(1.1)"
                        >
                          {L('لود مدل', 'Load')}
                        </Box>
                      </div>
                    )
                  })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
