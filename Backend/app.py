import os
import re
import json
import requests
import pandas as pd
import sentencepiece as spm
import torch
import torch.nn as nn
from torch.nn import functional as F
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---------------------------------------------------------
# 1. FastAPI Application & CORS Setup
# ---------------------------------------------------------
app = FastAPI(
    title="WeatherGPT Odisha API",
    description="Multilingual Meteorological Inference & Advisory Engine",
    version="1.0.0"
)

# Enable CORS so your frontend on localhost / another port can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domain in production (e.g. ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 2. PyTorch Model Definition
# ---------------------------------------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"

class Head(nn.Module):
    def __init__(self, head_size, n_embd, block_size, dropout=0.1):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        B, T, C = x.shape
        k = self.key(x)
        q = self.query(x)
        wei = q @ k.transpose(-2, -1) * (k.shape[-1] ** -0.5)
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        v = self.value(x)
        return wei @ v

class MultiHeadAttention(nn.Module):
    def __init__(self, num_heads, head_size, n_embd, block_size, dropout=0.1):
        super().__init__()
        self.heads = nn.ModuleList([Head(head_size, n_embd, block_size, dropout) for _ in range(num_heads)])
        self.proj = nn.Linear(n_embd, n_embd)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        return self.dropout(self.proj(out))

class FeedForward(nn.Module):
    def __init__(self, n_embd, dropout=0.1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.GELU(),
            nn.Linear(4 * n_embd, n_embd),
            nn.Dropout(dropout)
        )

    def forward(self, x):
        return self.net(x)

class Block(nn.Module):
    def __init__(self, n_embd, n_head, block_size, dropout=0.1):
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_head, head_size, n_embd, block_size, dropout)
        self.ffwd = FeedForward(n_embd, dropout)
        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)

    def forward(self, x):
        x = x + self.sa(self.ln1(x))
        x = x + self.ffwd(self.ln2(x))
        return x

class WeatherGPT(nn.Module):
    def __init__(self, vocab_size=8000, n_embd=256, block_size=128, n_layer=4, n_head=8):
        super().__init__()
        self.block_size = block_size
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(*[Block(n_embd, n_head, block_size) for _ in range(n_layer)])
        self.ln_f = nn.LayerNorm(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx, targets=None):
        B, T = idx.shape
        tok_emb = self.token_embedding_table(idx)
        pos_emb = self.position_embedding_table(torch.arange(T, device=idx.device))
        x = tok_emb + pos_emb
        x = self.blocks(x)
        x = self.ln_f(x)
        logits = self.lm_head(x)
        return logits, None

    def generate(self, idx, max_new_tokens):
        for _ in range(max_new_tokens):
            idx_cond = idx[:, -self.block_size:]
            logits, _ = self(idx_cond)
            logits = logits[:, -1, :]
            probs = F.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
            idx = torch.cat((idx, idx_next), dim=1)
        return idx

# ---------------------------------------------------------
# 3. Model & Tokenizer Loader
# ---------------------------------------------------------
tokenizer = None
model = None

def load_ml_resources():
    global tokenizer, model
    if os.path.exists("weathergpt_tok.model"):
        tokenizer = spm.SentencePieceProcessor()
        tokenizer.load("weathergpt_tok.model")
        print("[✓] SentencePiece Tokenizer loaded.")

    if os.path.exists("weather_gpt_model.pth"):
        model = WeatherGPT(vocab_size=8000, n_embd=256, block_size=128, n_layer=4, n_head=8).to(device)
        state_dict = torch.load("weather_gpt_model.pth", map_location=device)
        state_dict = {
            key.replace("token_embedding.", "token_embedding_table.")
                .replace("position_embedding.", "position_embedding_table."): value
            for key, value in state_dict.items()
        }
        model.load_state_dict(state_dict)
        model.eval()
        print(f"[✓] WeatherGPT weights loaded on {device.upper()}.")

load_ml_resources()

# Load CSVs into memory
df_w = pd.read_csv("Odisha_30_Districts_Historical_Weather_1995_2024.csv").dropna(subset=['Weather Condition', 'Location', 'Date']) if os.path.exists("Odisha_30_Districts_Historical_Weather_1995_2024.csv") else None
df_c = pd.read_csv("NIO_30_Years_Cyclone_Extended_ML_Dataset.csv").fillna("Unknown") if os.path.exists("NIO_30_Years_Cyclone_Extended_ML_Dataset.csv") else None

# ---------------------------------------------------------
# 4. Helper Engines & Parsers
# ---------------------------------------------------------
def detect_language(text: str) -> str:
    if any('\u0B00' <= ch <= '\u0B7F' for ch in text):
        return "odia"
    elif any('\u0900' <= ch <= '\u097F' for ch in text):
        return "hindi"
    return "english"

def detect_temporal_intent(query: str) -> str:
    forecast_keywords = [
        "today", "now", "current", "tomorrow", "forecast", "future", "upcoming", "next day",
        "आज", "कल", "आने वाले कल", "पूर्वानुमान", "मौसम कैसा रहेगा",
        "ଆଜି", "କାଲି", "ଆସନ୍ତାକାଲି", "ପୂର୍ବାନୁମାନ", "କିପରି ରହିବ"
    ]
    query_lower = query.lower()
    return "forecast" if any(kw in query_lower for kw in forecast_keywords) else "historical"

def extract_district(query: str):
    districts = [
        "angul", "balasore", "bhadrak", "balangir", "bhubaneswar",
        "cuttack", "deogarh", "dhenkanal", "gajapati", "ganjam",
        "jagatsinghpur", "jajpur", "jharsuguda", "kalahandi", "kandhamal",
        "kendrapara", "keonjhar", "khordha", "koraput", "malkangiri",
        "mayurbhanj", "nabarangpur", "nayagarh", "nuapada", "puri",
        "rayagada", "sambalpur", "subarnapur", "sundergarh"
    ]
    query_lower = query.lower()
    for d in districts:
        if d in query_lower:
            return d.capitalize()
    return None

def interpret_weather_code(code: int, lang: str = "english") -> str:
    conditions = {
        0: {"english": "Clear Sky", "hindi": "साफ आसमान", "odia": "ନିର୍ମଳ ଆକାଶ"},
        1: {"english": "Mainly Clear", "hindi": "मुख्यतः साफ", "odia": "ମୁଖ୍ୟତଃ ନିର୍ମଳ"},
        2: {"english": "Partly Cloudy", "hindi": "आंशिक रूप से बादल", "odia": "ଆଂଶିକ ମେଘୁଆ"},
        3: {"english": "Overcast", "hindi": "घने बादल", "odia": "ମେଘାଚ୍ଛନ୍ନ"},
        45: {"english": "Foggy", "hindi": "कोहरा", "odia": "କୁହୁଡ଼ି"},
        51: {"english": "Light Drizzle", "hindi": "हल्की बूंदाबांदी", "odia": "ହାଲୁକା ବୁନ୍ଦାବର୍ଷା"},
        61: {"english": "Slight Rain", "hindi": "हल्की बारिश", "odia": "ସାମାନ୍ୟ ବର୍ଷା"},
        63: {"english": "Moderate Rain", "hindi": "मध्यम बारिश", "odia": "ମଧ୍ୟମ ଧରଣର ବର୍ଷା"},
        65: {"english": "Heavy Rain", "hindi": "भारी बारिश", "odia": "ପ୍ରବଳ ବର୍ଷା"},
        95: {"english": "Thunderstorm", "hindi": "आंधी-तूफान", "odia": "ଘଡ଼ଘଡ଼ି ସହ ଝଡ଼ବର୍ଷା"}
    }
    match = conditions.get(code, {"english": "Variable Weather", "hindi": "परिवर्तनशील मौसम", "odia": "ପରିବର୍ତ୍ତନଶୀଳ ପାଣିପାଗ"})
    return match.get(lang, match["english"])

def get_live_weather(district_name: str, day_offset: int = 0):
    city = district_name if district_name else "Bhubaneswar"
    district_coords = {
        "Bhubaneswar": (20.2961, 85.8245), "Cuttack": (20.4625, 85.8828),
        "Puri": (19.8135, 85.8312), "Angul": (20.8444, 85.1511),
        "Balasore": (21.4934, 86.9135), "Sambalpur": (21.4669, 83.9812),
        "Balangir": (20.7107, 83.4854), "Bhadrak": (21.0543, 86.4955),
        "Mayurbhanj": (21.9287, 86.7378)
    }
    lat, lon = district_coords.get(city, (20.2961, 85.8245))
    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,weather_code"
        f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max"
        f"&timezone=Asia%2FKolkata"
    )
    try:
        res = requests.get(url, timeout=5).json()
        daily = res.get("daily", {})
        current = res.get("current", {})
        idx = day_offset if len(daily.get("temperature_2m_max", [])) > day_offset else 0
        w_code = current.get("weather_code") if day_offset == 0 else daily.get("weather_code", [0])[idx]
        return {
            "city": city,
            "weather_code": w_code,
            "current_temp": current.get("temperature_2m"),
            "current_humidity": current.get("relative_humidity_2m"),
            "max_temp": daily["temperature_2m_max"][idx],
            "min_temp": daily["temperature_2m_min"][idx],
            "rainfall": daily["precipitation_sum"][idx],
            "wind": daily["wind_speed_10m_max"][idx]
        }
    except Exception:
        return None

def lookup_cyclone_csv(query: str):
    if df_c is None:
        return None
    q_lower = query.lower()
    for name in df_c['Storm_Name'].dropna().unique():
        if str(name).strip() and str(name).lower() in q_lower:
            match = df_c[df_c['Storm_Name'].str.lower() == str(name).lower()]
            if not match.empty:
                return match.iloc[-1]
    if "super cyclone" in q_lower or "1999" in q_lower:
        match = df_c[(df_c['IMD_Grade'].str.contains("Super", case=False, na=False)) | 
                     (df_c['Date'].str.startswith("1999", na=False))]
        if not match.empty:
            return match.iloc[0]
    year_match = re.search(r'\b(19\d\d|20\d\d)\b', query)
    if year_match:
        match = df_c[df_c['Date'].astype(str).str.startswith(year_match.group(1))]
        if not match.empty:
            return match.iloc[0]
    return None

def lookup_historical_csv(district: str, query: str):
    if df_w is None:
        return None
    sub_df = df_w if district is None else df_w[df_w['Location'].str.lower() == district.lower()]
    if sub_df.empty:
        return None
    date_match = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', query)
    year_match = re.search(r'\b(19\d\d|20\d\d)\b', query)
    if date_match:
        row = sub_df[sub_df['Date'] == date_match.group(1)]
        if not row.empty:
            return row.iloc[0]
    elif year_match:
        row = sub_df[sub_df['Date'].str.startswith(year_match.group(1))]
        if not row.empty:
            return row.iloc[0]
    return sub_df.iloc[-1] if district is not None else None

def generate_fallback_llm(prompt: str) -> str:
    if model is None or tokenizer is None:
        return "Trained model or tokenizer not loaded."
    tokens = tokenizer.encode_as_ids(prompt)
    x = torch.tensor([tokens[-128:]], dtype=torch.long, device=device)
    out = model.generate(x, max_new_tokens=40)
    return tokenizer.decode_ids(out[0].tolist())

def generate_weather_suggestions(metrics: dict, lang: str = "english") -> list:
    suggestions = []
    max_t = metrics.get("max_temp", 30.0)
    rain = metrics.get("rainfall", 0.0)
    wind = metrics.get("wind", 10.0)
    is_cyclone = metrics.get("is_cyclone", False)

    if lang == "hindi":
        if rain == 0.0:
            suggestions.append("☀️ बारिश की संभावना नहीं: मौसम पूरी तरह शुष्क रहेगा।")
        elif rain < 5.0:
            suggestions.append(f"🌦️ हल्की बारिश की संभावना ({rain} mm): छाता साथ रखें।")
        else:
            suggestions.append(f"🌧️ भारी वर्षा चेतावनी ({rain} mm): जलभराव संभव है।")
        if is_cyclone or wind > 60:
            suggestions.append("🚨 तटीय / चक्रवात चेतावनी: मछुआरे समुद्र में न जाएं।")
        elif max_t > 38:
            suggestions.append("☀️ लू चेतावनी: दोपहर में सीधी धूप से बचें।")
    elif lang == "odia":
        if rain == 0.0:
            suggestions.append("☀️ ବର୍ଷା ସମ୍ଭାବନା ନାହିଁ: ପାଗ ଶୁଖିଲା ରହିବ।")
        elif rain < 5.0:
            suggestions.append(f"🌦️ ସାମାନ୍ୟ ବର୍ଷା ସମ୍ଭାବନା ({rain} mm): ଛତା ସାଙ୍ଗରେ ରଖନ୍ତୁ।")
        else:
            suggestions.append(f"🌧️ ପ୍ରବଳ ବର୍ଷା ସତର୍କତା ({rain} mm): ସତର୍କତା ଅବଲମ୍ବନ କରନ୍ତୁ।")
        if is_cyclone or wind > 60:
            suggestions.append("🚨 ବାତ୍ୟା ସତର୍କତା: ସମୁଦ୍ର ମଧ୍ୟକୁ ଯାଆନ୍ତୁ ନାହିଁ।")
        elif max_t > 38:
            suggestions.append("☀️ ପ୍ରଚଣ୍ଡ ଖରା: ପ୍ରଚୁର ପାଣି ପିଅନ୍ତୁ।")
    else:
        if rain == 0.0:
            suggestions.append("☀️ No Rain Expected: Conditions remain dry.")
        elif rain < 5.0:
            suggestions.append(f"🌦️ Light Rain Likely ({rain} mm): Passing showers possible.")
        else:
            suggestions.append(f"🌧️ Heavy Rain Alert ({rain} mm): Expect wet spells.")
        if is_cyclone or wind > 60:
            suggestions.append("🚨 Cyclone Warning: High winds detected. Stay alert.")
        elif max_t > 38:
            suggestions.append("☀️ Heatwave Advisory: Stay hydrated.")
    return suggestions

# ---------------------------------------------------------
# 5. API Endpoints & Request/Response Schemas
# ---------------------------------------------------------
class QueryRequest(BaseModel):
    query: str

class WeatherResponse(BaseModel):
    status: str
    question: str
    language: str
    intent: str
    response: str
    suggestions: list
    metrics: dict

@app.get("/")
def health_check():
    return {"status": "online", "service": "WeatherGPT API", "device": device}

@app.post("/api/predict", response_model=WeatherResponse)
def predict_weather(req: QueryRequest):
    user_question = req.query.strip()
    if not user_question:
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")

    lang = detect_language(user_question)
    intent = detect_temporal_intent(user_question)
    district = extract_district(user_question)
    is_cyclone = any(w in user_question.lower() for w in ["cyclone", "ବାତ୍ୟା", "चक्रवात", "storm"])

    metrics = {"max_temp": 30.0, "rainfall": 0.0, "wind": 10.0, "is_cyclone": is_cyclone}

    if intent == "forecast":
        is_tomorrow = any(w in user_question.lower() for w in ["tomorrow", "कल", "କାଲି", "ଆସନ୍ତାକାଲି"])
        data = get_live_weather(district, day_offset=1 if is_tomorrow else 0)
        if data:
            metrics.update({"max_temp": data['max_temp'], "rainfall": data['rainfall'], "wind": data['wind']})
            condition_text = interpret_weather_code(data.get('weather_code', 0), lang=lang)
            rain_status = "Rain Expected" if data['rainfall'] > 0.1 else "No Rain Expected"
            curr_str = f"Current Temp: {data['current_temp']}°C, Humidity: {data['current_humidity']}%. " if data.get("current_temp") is not None else ""
            label = "Tomorrow's forecast" if is_tomorrow else "Today's weather"

            response_msg = (
                f"{label} for {data['city']}: Condition: {condition_text}. {curr_str}"
                f"Max Temp: {data['max_temp']}°C, Min Temp: {data['min_temp']}°C. "
                f"Wind: {data['wind']} km/h. Precipitation: {data['rainfall']} mm ({rain_status})."
            )
        else:
            response_msg = "Live weather service is currently unreachable."
    else:
        cyclone_row = lookup_cyclone_csv(user_question) if is_cyclone else None
        if cyclone_row is not None:
            metrics["is_cyclone"] = True
            response_msg = (
                f"Historical Cyclone {cyclone_row['Storm_Name']} ({cyclone_row.get('Date', '')}): "
                f"Recorded as {cyclone_row.get('IMD_Grade', 'Cyclone')}. Wind: {cyclone_row.get('Max_Sustained_Wind_kt', 'N/A')} kt. "
                f"Landfall: {cyclone_row.get('Landfall_District', 'Unknown')}, {cyclone_row.get('Landfall_State', '')}."
            )
        else:
            csv_record = lookup_historical_csv(district, user_question)
            if csv_record is not None:
                metrics.update({
                    "max_temp": float(csv_record['Max Temperature (C)']),
                    "rainfall": float(csv_record['Rainfall (mm)']),
                    "wind": float(csv_record['Wind Speed (km/h)'])
                })
                response_msg = (
                    f"Historical Record ({csv_record['Date']}) for {csv_record['Location']}: {csv_record['Weather Condition']}. "
                    f"Max Temp: {csv_record['Max Temperature (C)']}°C, Rainfall: {csv_record['Rainfall (mm)']} mm."
                )
            else:
                response_msg = generate_fallback_llm(user_question)

    suggestions = generate_weather_suggestions(metrics, lang=lang)

    return {
        "status": "success",
        "question": user_question,
        "language": lang,
        "intent": intent,
        "response": response_msg,
        "suggestions": suggestions,
        "metrics": metrics
    }