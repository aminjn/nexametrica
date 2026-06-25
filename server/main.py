"""
Nexa Metrica API — phase 1.

Personalized AI assistant + report, plus the Super-Admin AI console: configure
providers (keys server-side only) and assign a provider+model to each agent
(every model task the platform needs). The CV/analytics pipeline will plug into
this same service later.
"""
import os
import time
from typing import Optional

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import llm
import store
import catalog

app = FastAPI(title="Nexa Metrica API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")


def require_admin(x_admin_token: str = Header(default="")):
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="admin not configured: set ADMIN_TOKEN in server/.env")
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="invalid admin token")


# ---------------- models ----------------
class Msg(BaseModel):
    role: str
    text: str


class Persona(BaseModel):
    style: Optional[str] = None
    depth: Optional[str] = None
    focus: Optional[str] = None


class ChatReq(BaseModel):
    message: str
    history: list[Msg] = []
    persona: Optional[Persona] = None
    lang: str = "fa"


class ReportReq(BaseModel):
    context: dict = {}
    lang: str = "fa"


class ProviderIn(BaseModel):
    id: Optional[str] = None
    name: str
    call: str = "openai"           # openai | anthropic | selfhosted
    base_url: str
    api_key: Optional[str] = None  # empty/None = keep existing
    models: Optional[list[str]] = None


class AgentAssignIn(BaseModel):
    provider_id: str
    model: str


# ---------------- prompts ----------------
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
        "adapt accordingly. When you lack data, say so and state your assumptions; don't fabricate numbers."
    )


# ---------------- public ----------------
@app.get("/api/health")
def health():
    cfg = llm.effective_cfg("assistant_chat")
    return {"ok": True, "assistant_ready": bool(cfg and cfg.get("api_key"))}


@app.post("/api/assistant/chat")
def assistant_chat(req: ChatReq):
    messages = [{"role": "system", "content": assistant_system_prompt(req.persona, req.lang)}]
    for m in req.history[-8:]:
        messages.append({"role": "assistant" if m.role == "ai" else "user", "content": m.text})
    messages.append({"role": "user", "content": req.message})
    cfg = llm.effective_cfg("assistant_chat")
    try:
        text = llm.chat(cfg, messages, max_tokens=800)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"assistant unavailable: {e}")
    return {"text": text}


@app.post("/api/report")
def report(req: ReportReq):
    lang = req.lang
    instruction = (
        "یک گزارشِ تحلیلیِ کوتاه و حرفه‌ایِ بازی به فارسی بنویس (۳ تا ۵ بند) و در پایان ۲ تا ۳ پیشنهادِ تاکتیکی بده."
        if lang == "fa"
        else "Write a short professional match analysis report (3-5 paragraphs) and finish with 2-3 tactical recommendations."
    )
    messages = [
        {"role": "system", "content": assistant_system_prompt(None, lang)},
        {"role": "user", "content": f"{instruction}\n\nDATA:\n{req.context}"},
    ]
    cfg = llm.effective_cfg("report_writer") or llm.effective_cfg("assistant_chat")
    try:
        text = llm.chat(cfg, messages, max_tokens=1200)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"report unavailable: {e}")
    return {"text": text}


# ---------------- admin: providers ----------------
def _mask(p: dict) -> dict:
    key = p.get("api_key") or ""
    return {
        "id": p["id"], "name": p["name"], "call": p.get("call", "openai"),
        "base_url": p["base_url"], "models": p.get("models") or [],
        "key_set": bool(key), "key_last4": key[-4:] if key else "",
    }


@app.get("/api/admin/providers", dependencies=[Depends(require_admin)])
def list_providers():
    return {"providers": [_mask(p) for p in llm.get_providers()]}


@app.post("/api/admin/providers", dependencies=[Depends(require_admin)])
def upsert_provider(body: ProviderIn):
    provs = llm.get_providers()
    pid = body.id or body.name.strip().lower().replace(" ", "-")
    existing = next((p for p in provs if p["id"] == pid), None)
    if existing:
        existing["name"] = body.name
        existing["call"] = body.call
        existing["base_url"] = body.base_url
        if body.models is not None:
            existing["models"] = body.models
        if body.api_key:
            existing["api_key"] = body.api_key
    else:
        provs.append({
            "id": pid, "name": body.name, "call": body.call, "base_url": body.base_url,
            "api_key": body.api_key or "", "models": body.models or [],
        })
    llm.save_providers(provs)
    return {"ok": True, "id": pid}


@app.delete("/api/admin/providers/{pid}", dependencies=[Depends(require_admin)])
def delete_provider(pid: str):
    provs = [p for p in llm.get_providers() if p["id"] != pid]
    llm.save_providers(provs)
    return {"ok": True}


@app.get("/api/admin/providers/{pid}/models", dependencies=[Depends(require_admin)])
def provider_models(pid: str):
    p = llm.get_provider(pid)
    if not p:
        raise HTTPException(status_code=404, detail="provider not found")
    return {"models": llm.list_models(p)}


@app.post("/api/admin/providers/{pid}/test", dependencies=[Depends(require_admin)])
def test_provider(pid: str):
    p = llm.get_provider(pid)
    if not p:
        raise HTTPException(status_code=404, detail="provider not found")
    if p.get("call") == "selfhosted":
        try:
            import httpx
            httpx.get(p["base_url"], timeout=8)
            return {"ok": True, "sample": "reachable"}
        except Exception as e:
            return {"ok": False, "detail": str(e)}
    if not p.get("api_key"):
        return {"ok": False, "detail": "no api key set"}
    model = (llm.list_models(p) or ["gpt-4o-mini"])[0]
    cfg = {"call": p.get("call", "openai"), "base_url": p["base_url"], "api_key": p["api_key"], "model": model, "temperature": 0}
    try:
        text = llm.chat(cfg, [{"role": "user", "content": "ping؛ فقط بنویس ok"}], max_tokens=8)
        return {"ok": True, "sample": text[:60], "model": model}
    except Exception as e:
        return {"ok": False, "detail": str(e)}


# ---------------- admin: agents ----------------
@app.get("/api/admin/agents", dependencies=[Depends(require_admin)])
def list_agents():
    assigns = store.get_settings().get("agents") or {}
    provs = {p["id"]: p["name"] for p in llm.get_providers()}
    out = []
    for a in catalog.agents_seed():
        asg = assigns.get(a["id"], {})
        out.append({
            **a,
            "provider_id": asg.get("provider_id", ""),
            "provider_name": provs.get(asg.get("provider_id", ""), ""),
            "model": asg.get("model", ""),
            "loaded_at": asg.get("loaded_at", 0),
        })
    return {"agents": out, "providers": [{"id": p["id"], "name": p["name"], "call": p.get("call", "openai")} for p in llm.get_providers()]}


@app.put("/api/admin/agents/{agent_id}", dependencies=[Depends(require_admin)])
def assign_agent(agent_id: str, body: AgentAssignIn):
    if agent_id not in {a["id"] for a in catalog.agents_seed()}:
        raise HTTPException(status_code=404, detail="unknown agent")
    s = store.get_settings()
    agents = dict(s.get("agents") or {})
    cur = dict(agents.get(agent_id, {}))
    cur["provider_id"] = body.provider_id
    cur["model"] = body.model
    cur["loaded_at"] = 0  # changing assignment invalidates "loaded"
    agents[agent_id] = cur
    store.save_settings({"agents": agents})
    return {"ok": True}


@app.post("/api/admin/agents/{agent_id}/load", dependencies=[Depends(require_admin)])
def load_agent(agent_id: str, ts: int = 0):
    seed = {a["id"]: a for a in catalog.agents_seed()}
    if agent_id not in seed:
        raise HTTPException(status_code=404, detail="unknown agent")
    s = store.get_settings()
    agents = dict(s.get("agents") or {})
    asg = agents.get(agent_id)
    if not asg or not asg.get("provider_id") or not asg.get("model"):
        return {"ok": False, "detail": "no provider/model assigned"}
    runtime = seed[agent_id]["runtime"]
    if runtime == "api":
        p = llm.get_provider(asg["provider_id"])
        cfg = {"call": p.get("call", "openai"), "base_url": p["base_url"], "api_key": p.get("api_key", ""), "model": asg["model"], "temperature": 0}
        try:
            llm.chat(cfg, [{"role": "user", "content": "ok"}], max_tokens=5)
        except Exception as e:
            return {"ok": False, "detail": str(e)}
    # self/cpu: actual GPU load happens on the Z400 worker later; record the request.
    asg["loaded_at"] = ts or int(time.time())
    agents[agent_id] = asg
    store.save_settings({"agents": agents})
    return {"ok": True, "loaded_at": asg["loaded_at"]}
