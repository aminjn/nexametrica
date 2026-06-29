"""
Provider-aware LLM client + helpers.

Supports OpenAI-compatible providers (OpenAI / Gemini-compat / DeepSeek / Iran
gateways) and Anthropic. Provider configs and per-agent model assignments live
in the settings store and are managed from the Super Admin panel.
"""
import os
import httpx

import store
import catalog


# ---------- providers ----------
def get_providers() -> list:
    s = store.get_settings()
    provs = s.get("providers")
    if not provs:
        provs = [dict(p) for p in catalog.DEFAULT_PROVIDERS]
        store.save_settings({"providers": provs})
        return provs
    # merge in any new default providers (e.g. gapgpt) without touching user data
    have = {p.get("id") for p in provs}
    added = False
    for d in catalog.DEFAULT_PROVIDERS:
        if d["id"] not in have:
            provs.append(dict(d))
            added = True
    if added:
        store.save_settings({"providers": provs})
    return provs


def get_provider(pid: str) -> dict | None:
    for p in get_providers():
        if p.get("id") == pid:
            return p
    return None


def save_providers(provs: list) -> None:
    store.save_settings({"providers": provs})


def list_models(provider: dict) -> list:
    """Alphabetically-sorted model ids for a provider."""
    manual = sorted([m for m in (provider.get("models") or []) if m])
    call = provider.get("call", "openai")
    if call == "openai" and provider.get("api_key"):
        try:
            url = provider["base_url"].rstrip("/") + "/models"
            r = httpx.get(
                url,
                headers={"Authorization": f"Bearer {provider['api_key']}"},
                timeout=20,
            )
            r.raise_for_status()
            ids = [m.get("id") for m in r.json().get("data", []) if m.get("id")]
            if ids:
                return sorted(ids)
        except Exception:
            pass
    return manual


# ---------- agent -> effective config ----------
def agent_assignment(agent_id: str) -> dict | None:
    return (store.get_settings().get("agents") or {}).get(agent_id)


def effective_cfg(agent_id: str) -> dict | None:
    """Resolve {call, base_url, api_key, model, temperature} for an agent."""
    a = agent_assignment(agent_id)
    s = store.get_settings()
    if a and a.get("provider_id") and a.get("model"):
        p = get_provider(a["provider_id"])
        if p:
            return {
                "call": p.get("call", "openai"),
                "base_url": p["base_url"],
                "api_key": p.get("api_key", ""),
                "model": a["model"],
                "temperature": s.get("llm_temperature", 0.5),
            }
    # legacy env fallback (so the assistant still works before agents are set)
    key = os.getenv("LLM_API_KEY", "")
    if key:
        return {
            "call": "openai",
            "base_url": os.getenv("LLM_BASE_URL", "https://api.openai.com/v1"),
            "api_key": key,
            "model": os.getenv("LLM_MODEL", "gpt-4o-mini"),
            "temperature": s.get("llm_temperature", 0.5),
        }
    return None


# ---------- chat ----------
def chat(cfg: dict, messages: list, max_tokens: int = 800) -> str:
    if not cfg or not cfg.get("api_key"):
        raise RuntimeError("agent has no configured provider/key")
    if cfg.get("call") == "anthropic":
        return _anthropic(cfg, messages, max_tokens)
    return _openai(cfg, messages, max_tokens)


def _openai(cfg, messages, max_tokens):
    url = cfg["base_url"].rstrip("/") + "/chat/completions"
    headers = {"Authorization": f"Bearer {cfg['api_key']}", "Content-Type": "application/json"}
    payload = {
        "model": cfg["model"],
        "messages": messages,
        "temperature": cfg.get("temperature", 0.5),
        "max_tokens": max_tokens,
    }
    with httpx.Client(timeout=httpx.Timeout(90.0)) as c:
        r = c.post(url, headers=headers, json=payload)
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()


def _anthropic(cfg, messages, max_tokens):
    url = cfg["base_url"].rstrip("/") + "/messages"
    system = " ".join(m["content"] for m in messages if m["role"] == "system")
    conv = [m for m in messages if m["role"] != "system"]
    headers = {
        "x-api-key": cfg["api_key"],
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
    }
    payload = {
        "model": cfg["model"],
        "system": system,
        "messages": [{"role": m["role"], "content": m["content"]} for m in conv],
        "max_tokens": max_tokens,
        "temperature": cfg.get("temperature", 0.5),
    }
    with httpx.Client(timeout=httpx.Timeout(90.0)) as c:
        r = c.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
        return "".join(b.get("text", "") for b in data.get("content", [])).strip()
