"""
Nexa Metrica API — phase 1.

Currently exposes the personalized AI assistant (and a match-report generator)
backed by a real LLM. The CV/analytics pipeline will plug into this same service
later (jobs, tracking data, stats endpoints).
"""
import os
from typing import Optional

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import llm
import store

app = FastAPI(title="Nexa Metrica API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- admin auth ----------
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")


def require_admin(x_admin_token: str = Header(default="")):
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="admin not configured: set ADMIN_TOKEN in server/.env")
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="invalid admin token")


# ---------- models ----------
class Msg(BaseModel):
    role: str  # "user" | "ai"
    text: str


class Persona(BaseModel):
    style: Optional[str] = None   # attack | defense
    depth: Optional[str] = None   # detailed | brief
    focus: Optional[str] = None   # tactical | statistical


class ChatReq(BaseModel):
    message: str
    history: list[Msg] = []
    persona: Optional[Persona] = None
    lang: str = "fa"


class ReportReq(BaseModel):
    context: dict = {}
    lang: str = "fa"


# ---------- prompts ----------
def assistant_system_prompt(p: Optional[Persona], lang: str) -> str:
    p = p or Persona()
    if lang == "fa":
        style = {"attack": "حمله‌محور و تهاجمی", "defense": "دفاعی و ساختارمحور"}.get(p.style or "", "متعادل")
        depth = {"detailed": "مفصل و عمیق", "brief": "کوتاه و خلاصه"}.get(p.depth or "", "متوسط")
        focus = {"tactical": "تاکتیکی", "statistical": "آماری و داده‌محور"}.get(p.focus or "", "ترکیبی")
        return (
            "تو «دستیار نکسا متریکا» هستی؛ یک تحلیل‌گرِ حرفه‌ایِ فوتبال برای کادرِ فنیِ تیمِ پارس تهران. "
            "همیشه به فارسیِ روان، دقیق و کاربردی برای مربی و آنالیزور پاسخ بده. "
            f"سبکِ تحلیلِ این کاربر {style}، با عمقِ {depth} و زاویه‌ی {focus} است؛ پاسخ‌هایت را با همین سبک تنظیم کن. "
            "هرجا داده‌ی کافی نداری، صادقانه بگو و فرض‌هایت را شفاف کن؛ از عددسازیِ بی‌پایه پرهیز کن. "
            "وقتی مفید است از متریک‌های استانداردِ فوتبال (xG، xA، PPDA، xThreat، مالکیت، پرس) استفاده کن."
        )
    return (
        "You are 'Nexa Metrica Assistant', a professional football analyst for the Pars Tehran staff. "
        "Answer in clear, precise English that is practical for a coach/analyst. "
        f"This user's style is {p.style or 'balanced'}, depth {p.depth or 'medium'}, focus {p.focus or 'mixed'}; "
        "adapt accordingly. When you lack data, say so and state your assumptions; don't fabricate numbers. "
        "Use standard football metrics (xG, xA, PPDA, xThreat, possession, press) where useful."
    )


# ---------- routes ----------
@app.get("/api/health")
def health():
    cfg = llm.llm_config()
    return {"ok": True, "llm_configured": llm.is_configured(), "model": cfg["model"]}


@app.post("/api/assistant/chat")
def assistant_chat(req: ChatReq):
    messages = [{"role": "system", "content": assistant_system_prompt(req.persona, req.lang)}]
    for m in req.history[-8:]:
        messages.append({"role": "assistant" if m.role == "ai" else "user", "content": m.text})
    messages.append({"role": "user", "content": req.message})
    try:
        text = llm.chat_completion(messages, max_tokens=800)
    except Exception as e:  # surfaced to the client, which falls back gracefully
        raise HTTPException(status_code=503, detail=f"LLM unavailable: {e}")
    return {"text": text}


# ---------- admin: LLM config (managed from the Super Admin panel) ----------
class LlmConfigIn(BaseModel):
    base_url: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[float] = None
    api_key: Optional[str] = None  # empty/None = keep the existing key


@app.get("/api/admin/llm-config", dependencies=[Depends(require_admin)])
def get_llm_config():
    cfg = llm.llm_config()
    key = cfg["api_key"]
    return {
        "base_url": cfg["base_url"],
        "model": cfg["model"],
        "temperature": cfg["temperature"],
        "key_set": bool(key),
        "key_last4": key[-4:] if key else "",
    }


@app.put("/api/admin/llm-config", dependencies=[Depends(require_admin)])
def put_llm_config(body: LlmConfigIn):
    patch: dict = {}
    if body.base_url is not None:
        patch["llm_base_url"] = body.base_url.strip()
    if body.model is not None:
        patch["llm_model"] = body.model.strip()
    if body.temperature is not None:
        patch["llm_temperature"] = float(body.temperature)
    if body.api_key:  # only overwrite when a non-empty key is provided
        patch["llm_api_key"] = body.api_key.strip()
    store.save_settings(patch)
    return {"ok": True}


@app.post("/api/admin/llm-test", dependencies=[Depends(require_admin)])
def llm_test():
    try:
        text = llm.chat_completion(
            [{"role": "user", "content": "اتصال را تست کن؛ فقط بنویس: ok"}],
            max_tokens=8,
        )
        return {"ok": True, "sample": text[:60]}
    except Exception as e:
        return {"ok": False, "detail": str(e)}


@app.post("/api/report")
def report(req: ReportReq):
    lang = req.lang
    instruction = (
        "یک گزارشِ تحلیلیِ کوتاه و حرفه‌ایِ بازی به فارسی بنویس (۳ تا ۵ بند). "
        "از داده‌های زیر استفاده کن و در پایان ۲ تا ۳ پیشنهادِ تاکتیکی بده."
        if lang == "fa"
        else
        "Write a short professional match analysis report (3-5 paragraphs) using the data below, "
        "and finish with 2-3 tactical recommendations."
    )
    messages = [
        {"role": "system", "content": assistant_system_prompt(None, lang)},
        {"role": "user", "content": f"{instruction}\n\nDATA:\n{req.context}"},
    ]
    try:
        text = llm.chat_completion(messages, max_tokens=1200)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM unavailable: {e}")
    return {"text": text}
