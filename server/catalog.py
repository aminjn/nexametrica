"""
Catalog of AI providers (defaults) and the COMPLETE list of agents (every model
task the platform needs). Agents are assigned a provider + model in the Super
Admin panel. `runtime`: api = cloud LLM/embed/asr, self = self-hosted GPU
(Z400) computer-vision, cpu = classic ML that runs locally.
"""

# call: how we talk to the provider.
#   openai     -> OpenAI-compatible /chat/completions (+ /models listing)
#   anthropic  -> Anthropic /v1/messages
#   selfhosted -> our own GPU worker (custom); model list is manual
DEFAULT_PROVIDERS = [
    # GapGPT — Iranian OpenAI-compatible gateway (works from Iran, Rial billing).
    # Just paste your key in the Super-Admin console. Models auto-load from /models
    # when a key is set; this manual list is the fallback.
    {"id": "gapgpt", "name": "GapGPT (گپ‌جی‌پی‌تی)", "call": "openai",
     "base_url": "https://api.gapgpt.app/v1", "api_key": "",
     "models": ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o3-mini",
                "gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash",
                "claude-3-7-sonnet", "claude-3-5-sonnet", "deepseek-chat"]},
    {"id": "openai", "name": "OpenAI", "call": "openai",
     "base_url": "https://api.openai.com/v1", "api_key": "", "models": []},
    {"id": "gemini", "name": "Google Gemini", "call": "openai",
     "base_url": "https://generativelanguage.googleapis.com/v1beta/openai", "api_key": "",
     "models": ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro"]},
    {"id": "anthropic", "name": "Anthropic Claude", "call": "anthropic",
     "base_url": "https://api.anthropic.com/v1", "api_key": "",
     "models": ["claude-3-5-haiku-latest", "claude-3-7-sonnet-latest", "claude-opus-4-1"]},
    {"id": "deepseek", "name": "DeepSeek", "call": "openai",
     "base_url": "https://api.deepseek.com/v1", "api_key": "",
     "models": ["deepseek-chat", "deepseek-reasoner"]},
    {"id": "selfhosted", "name": "میزبانی شخصی (Z400 GPU)", "call": "selfhosted",
     "base_url": "http://127.0.0.1:9000", "api_key": "", "models": []},
]

# group, group_en, then agents. kind is informational; runtime drives behavior.
# Bump when DEFAULT_PROVIDERS changes so new defaults merge ONCE (then user
# deletions stick — we don't re-add them every call).
PROVIDER_SEED_VERSION = 2

# Agents actually implemented in the real pipeline (worker CV / LLM). The rest are
# planned — shown honestly as "planned", not fake-configurable.
ACTIVE_AGENTS = {
    "object_detection", "tracking", "camera_calibration", "pitch_keypoints",
    "reid", "jersey_ocr", "team_classification", "ball_possession",
    "event_detection", "heatmap", "report_writer", "assistant_chat",
}

AGENTS = [
    # ---- Vision perception (self-hosted GPU) ----
    ("object_detection", "ادراک بینایی", "Vision perception", "vision", "self", "تشخیص اشیاء (بازیکن/توپ/داور/دروازه)", "Object detection", "YOLO11 / RT-DETR"),
    ("tracking", "ادراک بینایی", "Vision perception", "vision", "self", "ردیابی چندهدفه (MOT)", "Multi-object tracking", "ByteTrack / BoT-SORT"),
    ("segmentation", "ادراک بینایی", "Vision perception", "vision", "self", "قطعه‌بندی (Segmentation)", "Segmentation", "SAM2 / YOLO-Seg"),
    ("pitch_keypoints", "ادراک بینایی", "Vision perception", "vision", "self", "کی‌پوینت و خطوط زمین", "Pitch keypoints", "RTMPose / HRNet"),
    ("camera_calibration", "ادراک بینایی", "Vision perception", "vision", "self", "کالیبراسیون دوربین (Homography)", "Camera calibration", "DeepHomo"),
    ("reid", "ادراک بینایی", "Vision perception", "vision", "self", "بازشناسی مجدد بازیکن (Re-ID)", "Player Re-ID", "FastReID / OSNet"),
    ("jersey_ocr", "ادراک بینایی", "Vision perception", "vision", "self", "تشخیص شماره پیراهن", "Jersey number OCR", "PaddleOCR / TrOCR"),
    ("team_classification", "ادراک بینایی", "Vision perception", "vision", "self", "تشخیص تیم (رنگ پیراهن)", "Team classification", "KMeans / ResNet"),
    ("pose", "ادراک بینایی", "Vision perception", "vision", "self", "تشخیص حالت بدن (Pose)", "Pose estimation", "YOLO-Pose"),
    # ---- Events & actions ----
    ("ball_possession", "رویداد و کنش", "Events & actions", "event", "self", "تشخیص مالک توپ", "Ball possession", "Distance / GNN"),
    ("event_detection", "رویداد و کنش", "Events & actions", "event", "self", "تشخیص رویداد (پاس/شوت/تکل/کرنر)", "Event detection", "VideoMAE / heuristic"),
    ("action_recognition", "رویداد و کنش", "Events & actions", "event", "self", "تشخیص کنش بازیکن", "Action recognition", "SlowFast / I3D"),
    # ---- Tactics & space ----
    ("formation_detection", "تاکتیک و فضا", "Tactics & space", "graph", "cpu", "تشخیص آرایش (Formation)", "Formation detection", "GNN / Clustering"),
    ("tactical_analysis", "تاکتیک و فضا", "Tactics & space", "graph", "cpu", "تحلیل تاکتیکی (پرس/ضدحمله)", "Tactical analysis", "ST-GCN / GAT"),
    ("pitch_control", "تاکتیک و فضا", "Tactics & space", "graph", "cpu", "کنترل فضا (Pitch Control)", "Pitch control", "Voronoi / model"),
    ("heatmap", "تاکتیک و فضا", "Tactics & space", "graph", "cpu", "تولید نقشه‌ی حرارتی", "Heatmap generation", "KDE"),
    # ---- Predictive (tabular) ----
    ("xg", "پیش‌بینی و امتیاز", "Predictive", "tabular", "cpu", "مدل xG (گل مورد انتظار)", "Expected goals (xG)", "XGBoost / LightGBM"),
    ("match_prediction", "پیش‌بینی و امتیاز", "Predictive", "tabular", "cpu", "پیش‌بینی نتیجه‌ی بازی", "Match prediction", "LightGBM / CatBoost"),
    ("live_prediction", "پیش‌بینی و امتیاز", "Predictive", "tabular", "cpu", "پیش‌بینی زنده‌ی بازی", "Live prediction", "LSTM / TFT"),
    ("player_rating", "پیش‌بینی و امتیاز", "Predictive", "tabular", "cpu", "امتیازدهی بازیکن", "Player rating", "LightGBM"),
    ("injury_prediction", "پیش‌بینی و امتیاز", "Predictive", "tabular", "cpu", "پیش‌بینی مصدومیت", "Injury prediction", "TFT / XGBoost"),
    # ---- Scouting & similarity ----
    ("player_similarity", "اسکاوتینگ و شباهت", "Scouting & similarity", "embed", "api", "بازیکن مشابه (Similarity)", "Player similarity", "Embeddings + FAISS"),
    ("talent_scouting", "اسکاوتینگ و شباهت", "Scouting & similarity", "tabular", "cpu", "استعدادیابی", "Talent scouting", "LightGBM"),
    ("recommendation", "اسکاوتینگ و شباهت", "Scouting & similarity", "embed", "api", "پیشنهاد خرید بازیکن", "Transfer recommendation", "Embeddings / FAISS"),
    # ---- Language & audio (cloud API) ----
    ("report_writer", "زبان و صوت", "Language & audio", "llm", "api", "گزارش‌نویس فارسی", "Report writer", "Claude / GPT / Gemini"),
    ("assistant_chat", "زبان و صوت", "Language & audio", "llm", "api", "دستیار/چت‌بات تحلیل (RAG)", "Analyst assistant", "Claude / GPT / Gemini"),
    ("news_nlp", "زبان و صوت", "Language & audio", "llm", "api", "تحلیل اخبار و شبکه‌های اجتماعی", "News & social NLP", "BERT / LLM"),
    ("asr", "زبان و صوت", "Language & audio", "asr", "api", "گفتار به متن (ASR)", "Speech-to-text", "Whisper"),
    ("embeddings", "زبان و صوت", "Language & audio", "embed", "api", "تعبیه‌ی متنی (Embeddings)", "Text embeddings", "text-embedding-3"),
]


def agents_seed():
    out = []
    for a in AGENTS:
        out.append({
            "id": a[0], "group": a[1], "group_en": a[2], "kind": a[3],
            "runtime": a[4], "name": a[5], "name_en": a[6], "hint": a[7],
        })
    return out
