"""
Minimal, provider-agnostic LLM client (OpenAI-compatible Chat Completions).

Works with OpenAI, Google Gemini (its OpenAI-compatible endpoint), DeepSeek,
and the OpenAI-compatible gateways commonly used from Iran. The effective config
(base_url / api_key / model / temperature) is resolved in main.py from the
settings store (managed in the Super Admin panel), falling back to env vars.
"""
import os
import httpx
import store


def llm_config() -> dict:
    """Effective config: Super-Admin-saved settings override env defaults."""
    s = store.get_settings()
    return {
        "base_url": (s.get("llm_base_url") or os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")).rstrip("/"),
        "api_key": s.get("llm_api_key") or os.getenv("LLM_API_KEY", ""),
        "model": s.get("llm_model") or os.getenv("LLM_MODEL", "gpt-4o-mini"),
        "temperature": s.get("llm_temperature", 0.5),
    }


def is_configured() -> bool:
    return bool(llm_config()["api_key"])


def chat_completion(messages, cfg: dict | None = None, max_tokens: int = 800) -> str:
    cfg = cfg or llm_config()
    if not cfg.get("api_key"):
        raise RuntimeError("LLM not configured (no API key)")
    url = cfg["base_url"].rstrip("/") + "/chat/completions"
    headers = {
        "Authorization": f"Bearer {cfg['api_key']}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": cfg["model"],
        "messages": messages,
        "temperature": cfg.get("temperature", 0.5),
        "max_tokens": max_tokens,
    }
    with httpx.Client(timeout=httpx.Timeout(90.0)) as client:
        r = client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
    return data["choices"][0]["message"]["content"].strip()
