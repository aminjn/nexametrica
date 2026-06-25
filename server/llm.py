"""
Minimal, provider-agnostic LLM client (OpenAI-compatible Chat Completions).

Works with OpenAI, Google Gemini (its OpenAI-compatible endpoint), DeepSeek,
and the OpenAI-compatible gateways commonly used from Iran — just point
LLM_BASE_URL / LLM_API_KEY / LLM_MODEL at your provider. No vendor SDK needed.

Env:
  LLM_BASE_URL   e.g. https://api.openai.com/v1
                 Gemini (OpenAI-compat): https://generativelanguage.googleapis.com/v1beta/openai
                 DeepSeek: https://api.deepseek.com/v1
                 or your reseller/gateway base URL
  LLM_API_KEY    your key (kept server-side only — never sent to the browser)
  LLM_MODEL      e.g. gpt-4o-mini | gemini-2.0-flash | deepseek-chat
"""
import os
import httpx

LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1").rstrip("/")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")


def is_configured() -> bool:
    return bool(LLM_API_KEY)


def chat_completion(messages, temperature: float = 0.5, max_tokens: int = 800) -> str:
    if not LLM_API_KEY:
        raise RuntimeError("LLM_API_KEY is not set")
    url = f"{LLM_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": LLM_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    with httpx.Client(timeout=httpx.Timeout(90.0)) as client:
        r = client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
    return data["choices"][0]["message"]["content"].strip()
