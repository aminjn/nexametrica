// Functional LLM-provider config for the Super Admin panel. Loads/saves/tests
// the provider, endpoint, model, temperature and API key via the admin API.
// The key is write-only (never read back); only "set ••••last4" is shown.
import { useEffect, useState } from 'react'
import { css } from '../lib/css'
import { Box } from './Box'
import {
  getAdminToken,
  setAdminToken,
  getLlmConfig,
  saveLlmConfig,
  testLlm,
  type LlmConfig,
} from '../adminApi'

const PRESETS: Record<string, { base_url: string; model: string }> = {
  OpenAI: { base_url: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  Gemini: {
    base_url: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.0-flash',
  },
  DeepSeek: { base_url: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
}

export function AdminLlmConfig({ v }: { v: Record<string, any> }) {
  const fa = v.lang === 'fa'
  const L = (f: string, e: string) => (fa ? f : e)

  const [needToken, setNeedToken] = useState(!getAdminToken())
  const [tokenInput, setTokenInput] = useState('')
  const [cfg, setCfg] = useState<LlmConfig | null>(null)
  const [baseUrl, setBaseUrl] = useState('')
  const [model, setModel] = useState('')
  const [temp, setTemp] = useState('0.5')
  const [apiKey, setApiKey] = useState('')
  const [msg, setMsg] = useState<{ k: 'ok' | 'err' | 'info'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    try {
      const c = await getLlmConfig()
      setCfg(c)
      setBaseUrl(c.base_url)
      setModel(c.model)
      setTemp(String(c.temperature))
      setNeedToken(false)
    } catch (err) {
      const code = String((err as Error).message)
      if (code === '401') setMsg({ k: 'err', t: L('توکن ادمین نامعتبر است.', 'Invalid admin token.') })
      else if (code === '503')
        setMsg({
          k: 'err',
          t: L('ADMIN_TOKEN روی سرور تنظیم نشده (در server/.env).', 'ADMIN_TOKEN not set on the server (server/.env).'),
        })
      else setMsg({ k: 'err', t: L('اتصال به سرور برقرار نشد.', 'Could not reach the server.') })
      setNeedToken(true)
    }
  }

  useEffect(() => {
    if (getAdminToken()) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function applyPreset(name: string) {
    setBaseUrl(PRESETS[name].base_url)
    setModel(PRESETS[name].model)
  }

  async function onSave() {
    setBusy(true)
    setMsg(null)
    try {
      await saveLlmConfig({
        base_url: baseUrl,
        model,
        temperature: parseFloat(temp) || 0.5,
        api_key: apiKey || undefined,
      })
      setApiKey('')
      await load()
      setMsg({ k: 'ok', t: L('ذخیره شد.', 'Saved.') })
    } catch {
      setMsg({ k: 'err', t: L('ذخیره نشد (توکن ادمین یا سرور؟).', 'Save failed (admin token / server?).') })
    } finally {
      setBusy(false)
    }
  }

  async function onTest() {
    setBusy(true)
    setMsg({ k: 'info', t: L('در حال تست…', 'Testing…') })
    try {
      const r = await testLlm()
      setMsg(
        r.ok
          ? { k: 'ok', t: L('اتصال موفق ✓ ', 'Connection OK ✓ ') + (r.sample || '') }
          : { k: 'err', t: L('اتصال ناموفق: ', 'Failed: ') + (r.detail || '') },
      )
    } catch (err) {
      const code = String((err as Error).message)
      setMsg({
        k: 'err',
        t:
          code === '503'
            ? L('ADMIN_TOKEN روی سرور تنظیم نشده.', 'ADMIN_TOKEN not set on server.')
            : L('توکن ادمین نامعتبر است.', 'Invalid admin token.'),
      })
    } finally {
      setBusy(false)
    }
  }

  const card = 'background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px;margin-bottom:14px'
  const label = 'font-size:11.5px;font-weight:700;color:var(--sub);margin-bottom:6px'
  const input =
    'width:100%;height:40px;background:var(--bg2);border:1px solid var(--bd2);border-radius:10px;color:var(--tx);font-family:inherit;font-size:13px;padding:0 12px;outline:none'

  const banner = msg ? (
    <div
      style={css(
        `margin-top:14px;padding:10px 13px;border-radius:10px;font-size:12px;font-weight:600;` +
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

  // ---- token gate ----
  if (needToken) {
    return (
      <div style={css(card)}>
        <div style={css('font-weight:800;font-size:15px;margin-bottom:6px')}>
          {L('تنظیمات API هوش مصنوعی', 'AI API settings')}
        </div>
        <div style={css('font-size:12px;color:var(--mut);line-height:1.8;margin-bottom:14px')}>
          {L(
            'برای مدیریت کلید و مدل، توکن ادمین را وارد کن (همان ADMIN_TOKEN در server/.env سرور).',
            'Enter the admin token (the ADMIN_TOKEN from server/.env) to manage the key and model.',
          )}
        </div>
        <div style={css('display:flex;gap:10px;align-items:center;max-width:520px')}>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput((e.target as HTMLInputElement).value)}
            placeholder={L('توکن ادمین', 'Admin token')}
            style={css(input + ';flex:1')}
          />
          <button
            onClick={() => {
              setAdminToken(tokenInput.trim())
              setTokenInput('')
              load()
            }}
            style={css(
              'height:40px;padding:0 18px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer;flex-shrink:0',
            )}
          >
            {L('ورود', 'Unlock')}
          </button>
        </div>
        {banner}
      </div>
    )
  }

  // ---- config form ----
  return (
    <div style={css(card)}>
      <div style={css('display:flex;align-items:center;gap:8px;margin-bottom:4px')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ai)">
          <path d="M12 2.2 14 8.4 20 10l-6 1.6L12 18l-2-6.4L4 10z" />
        </svg>
        <div style={css('font-weight:800;font-size:15px')}>
          {L('تنظیمات API هوش مصنوعی', 'AI API settings')}
        </div>
        <span
          style={css(
            'margin-inline-start:auto;font-size:11px;font-weight:700;color:var(--good);display:flex;align-items:center;gap:6px',
          )}
        >
          <span style={css('width:7px;height:7px;border-radius:50%;background:var(--good)')}></span>
          {cfg?.key_set
            ? L(`کلید تنظیم شده · ••••${cfg.key_last4}`, `Key set · ••••${cfg.key_last4}`)
            : L('کلید تنظیم نشده', 'No key set')}
        </span>
      </div>
      <div style={css('font-size:11.5px;color:var(--mut);margin-bottom:16px')}>
        {L(
          'این تنظیمات سمت سرور ذخیره می‌شوند و دستیار هوشمند از همین‌ها استفاده می‌کند.',
          'Saved server-side; the AI assistant uses these.',
        )}
      </div>

      <div style={css('display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap')}>
        {Object.keys(PRESETS).map((name) => (
          <Box
            key={name}
            as="button"
            onClick={() => applyPreset(name)}
            css="height:32px;padding:0 13px;background:var(--bg2);border:1px solid var(--bd2);border-radius:8px;color:var(--sub);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer"
            hover="border-color:var(--ai);color:var(--tx)"
          >
            {name}
          </Box>
        ))}
      </div>

      <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
        <div style={css('grid-column:1 / -1')}>
          <div style={css(label)}>{L('آدرس Endpoint', 'Endpoint URL')}</div>
          <input value={baseUrl} onChange={(e) => setBaseUrl((e.target as HTMLInputElement).value)} style={css(input)} />
        </div>
        <div>
          <div style={css(label)}>{L('مدل', 'Model')}</div>
          <input value={model} onChange={(e) => setModel((e.target as HTMLInputElement).value)} style={css(input)} />
        </div>
        <div>
          <div style={css(label)}>{L('دما (Temperature)', 'Temperature')}</div>
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={temp}
            onChange={(e) => setTemp((e.target as HTMLInputElement).value)}
            style={css(input)}
          />
        </div>
        <div style={css('grid-column:1 / -1')}>
          <div style={css(label)}>
            {L('کلید API', 'API key')}{' '}
            <span style={css('color:var(--mut);font-weight:500')}>
              {cfg?.key_set ? L('(خالی بگذار تا تغییر نکند)', '(leave blank to keep)') : ''}
            </span>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey((e.target as HTMLInputElement).value)}
            placeholder={cfg?.key_set ? '••••••••' : L('کلید را وارد کن', 'Enter key')}
            style={css(input)}
          />
        </div>
      </div>

      <div style={css('display:flex;gap:10px;margin-top:18px;align-items:center')}>
        <button
          onClick={onSave}
          disabled={busy}
          style={css(
            'height:40px;padding:0 20px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer',
          )}
        >
          {L('ذخیره تغییرات', 'Save changes')}
        </button>
        <button
          onClick={onTest}
          disabled={busy}
          style={css(
            'height:40px;padding:0 18px;background:var(--card2);border:1px solid var(--bd2);border-radius:10px;color:var(--tx);font-family:inherit;font-size:13px;font-weight:700;cursor:pointer',
          )}
        >
          {L('تست اتصال', 'Test connection')}
        </button>
        <div style={css('flex:1')}></div>
        <button
          onClick={() => {
            setAdminToken('')
            setNeedToken(true)
            setCfg(null)
          }}
          style={css(
            'height:40px;padding:0 14px;background:none;border:none;color:var(--mut);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer',
          )}
        >
          {L('خروج ادمین', 'Lock')}
        </button>
      </div>
      {banner}
    </div>
  )
}
