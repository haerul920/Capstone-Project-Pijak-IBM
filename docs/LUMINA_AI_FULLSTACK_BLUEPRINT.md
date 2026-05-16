# Lumina OS: Contextual Retail Intelligence Architecture

This document defines the final, refactored architecture for the Lumina Assistant. It combines real Machine Learning forecasting with a lightweight conversational layer grounded strictly in retail operational data.

---

## 1. System Architecture

```text
backend/
├── brain/
│   ├── demand_model.pkl      # RandomForest Forecasting Model
│   ├── intent_model.pkl      # NLP Intent Classifier
│   └── vectorizer.pkl        # TF-IDF Vectorizer
├── logic/
│   ├── encoders.py           # Categorical Mapping Utilities
│   ├── forecasting.py        # ML Prediction Engine
│   ├── memory.py             # Contextual Retail Memory
│   └── reasoning.py          # Operational Intelligence Layer
└── assistant.py              # Main Integration Handler
```

---

## 2. Phase 1: Grounded Intent Training (Colab)

Train a classifier to understand user intent without external APIs.

```python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Intent Dataset grounded in Retail Analytics
data = {
    'text': [
        'prediksi demand besok', 'forecast penjualan minggu depan', 'ramalan stok',
        'cek inventaris', 'berapa sisa stok?', 'stok yang tersedia',
        'produk demand tertinggi', 'barang paling dicari', 'analisis tren demand',
        'rekomendasi restock', 'apakah perlu order lagi?', 'saran stok',
        'performa wilayah jakarta', 'statistik penjualan regional', 'omzet per wilayah'
    ],
    'intent': [
        'demand_forecast', 'demand_forecast', 'demand_forecast',
        'inventory_check', 'inventory_check', 'inventory_check',
        'trend_analysis', 'trend_analysis', 'trend_analysis',
        'reorder_recommendation', 'reorder_recommendation', 'reorder_recommendation',
        'regional_analytics', 'regional_analytics', 'regional_analytics'
    ]
}

df = pd.DataFrame(data)
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['text'])
clf = LogisticRegression()
clf.fit(X, df['intent'])

joblib.dump(clf, 'intent_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')
```

---

## 3. Phase 2: Contextual Retail Memory

The system remembers the last discussed entity (Product/Category) for follow-up analysis.

### `logic/memory.py`

```python
class RetailMemory:
    def __init__(self):
        self.sessions = {}
        self.model = joblib.load('brain/demand_model.pkl')
        self.intent_clf = joblib.load('brain/intent_model.pkl')
        self.vectorizer = joblib.load('brain/vectorizer.pkl')

        self.memory = RetailMemory()
        self.reasoning = RetailReasoning()

        self.encoders = RetailEncoders()

    def get_context(self, session_id):
        return self.sessions.get(session_id, {
            "last_product_id": None,
            "last_category": None,
            "last_forecast": None
        })

    def update(self, session_id, **kwargs):
        if session_id not in self.sessions:
            self.sessions[session_id] = {"last_product_id": None, "last_category": None, "last_forecast": None}
        self.sessions[session_id].update(kwargs)
```

---

## 4. Phase 3: Operational Reasoning & Encoders

### `logic/encoders.py`

```python
import joblib

class RetailEncoders:
    def __init__(self):
        self.category_encoder = joblib.load('brain/category_encoder.pkl')
        self.region_encoder = joblib.load('brain/region_encoder.pkl')
        self.weather_encoder = joblib.load('brain/weather_encoder.pkl')
        self.holiday_encoder = joblib.load('brain/holiday_encoder.pkl')
        self.seasonality_encoder = joblib.load('brain/seasonality_encoder.pkl')

    def encode_category(self, value):
        return self.category_encoder.transform([value])[0]

    def encode_region(self, value):
        return self.region_encoder.transform([value])[0]

    def encode_weather(self, value):
        return self.weather_encoder.transform([value])[0]

    def encode_holiday(self, value):
        return self.holiday_encoder.transform([value])[0]

    def encode_seasonality(self, value):
        return self.seasonality_encoder.transform([value])[0]


```

### `logic/reasoning.py`

```python
class RetailReasoning:
    def explain_forecast(self, prediction, features):
        # features order: [Inv, Sold, Ord, Price, Disc, Comp, Cat, Reg, Weath, Hol, Sea, Mo, DoW]
        weather_map = {0: "Cerah", 1: "Hujan", 2: "Berawan"}
        weather = weather_map.get(features[8], "Normal")
        is_holiday = features[9] == 1
        is_promo = features[9] == 2
        is_high_season = features[10] == 2

        reasons = []
        if is_high_season: reasons.append("tren high season yang kuat")
        if is_holiday: reasons.append("lonjakan trafik hari libur")
        if is_promo: reasons.append("efek promosi aktif")
        if weather == "Hujan": reasons.append("sedikit hambatan karena cuaca hujan")

        reason_text = " dan ".join(reasons) if reasons else "tren penjualan organik"
        return f"Permintaan diperkirakan mencapai {prediction:.1f} unit karena dipengaruhi oleh {reason_text}."

    def get_reorder_logic(self, stock, forecast):
        if stock <= 0: return "KRITIS: Stok habis total. Segera lakukan reorder darurat."
        if stock < forecast:
            return f"Sangat Direkomendasikan. Stok saat ini ({stock}) tidak cukup untuk memenuhi prediksi demand ({forecast:.0f})."
        if stock < (forecast * 1.5):
            return f"Saran: Stok mulai menipis ({stock}). Lakukan restock kecil untuk menjaga buffer."
        return f"Stok aman ({stock}). Masih mencukupi untuk memenuhi demand forecast."
```

---

## 5. Phase 4: Master Assistant (Supabase Dynamic Logic)

### `assistant.py`

```python
import joblib
import numpy as np
from datetime import datetime
from logic.memory import RetailMemory
from logic.reasoning import RetailReasoning
from logic.encoders import RetailEncoders
from database import supabase

class LuminaAssistant:
    def __init__(self):
        self.model = joblib.load('brain/demand_model.pkl')
        self.intent_clf = joblib.load('brain/intent_model.pkl')
        self.vectorizer = joblib.load('brain/vectorizer.pkl')
        self.memory = RetailMemory()
        self.reasoning = RetailReasoning()

    # --- Supabase Helpers with Null Handling ---
    def _get_product(self, pid):
        res = supabase.table("products").select("id, name, price, discount, category, competitor_price, weather, holiday, seasonality").eq("id", pid).execute()
        return res.data[0] if res.data else None

    def _get_inventory(self, pid):
        res = supabase.table("inventory").select("stock_level, region").eq("product_id", pid).execute()
        return res.data[0] if res.data else None

    def _get_sales(self, pid, limit=1):
        res = supabase.table("sales_history").select("units_sold, units_ordered").eq("product_id", pid).order("date", desc=True).limit(limit).execute()
        return res.data if res.data else [{"units_sold": 0, "units_ordered": 0}]

    # --- Main Chat Handler ---
    def handle_query(self, session_id, query):
        vec = self.vectorizer.transform([query.lower()])
        intent = self.intent_clf.predict(vec)[0]
        context = self.memory.get_context(session_id)

        if intent == "trend_analysis":
            return self._handle_top_performing(session_id)
        elif intent == "demand_forecast":
            return self._handle_forecast(session_id, context)
        elif intent == "inventory_check":
            return self._handle_inventory(session_id, context)

        return {"text": "Halo! Saya Lumina Assistant. Coba tanya: 'siapa produk terlaris?'", "chart": None}

    def _handle_top_performing(self, session_id):
        # AGGREGATE: Fetch all and sum in Python (Realistic Analytics)
        sales_res = supabase.table("sales_history").select("product_id, units_sold").execute()
        if not sales_res.data: return {"text": "Data penjualan belum tersedia.", "chart": None}

        agg = {}
        for r in sales_res.data:
            agg[r["product_id"]] = agg.get(r["product_id"], 0) + r["units_sold"]

        top_list = sorted(agg.items(), key=lambda x: x[1], reverse=True)[:5]
        labels, values = [], []

        for pid, total in top_list:
            p = self._get_product(pid)
            if p:
                labels.append(p['name'])
                values.append(total)

        if top_list:
            best_pid = top_list[0][0]
            best_p = self._get_product(best_pid)
            self.memory.update(session_id, last_product_id=best_pid, last_category=best_p['category'])

        return {
            "text": f"Produk terlaris Anda saat ini adalah {labels[0]} dengan total {values[0]} unit terjual.",
            "chart": {
                "type": "bar",
                "title": "Top 5 Sales Accumulation",
                "labels": labels,
                "datasets": [{"label": "Total Terjual", "data": values}]
            }
        }

    def _handle_forecast(self, session_id, context):
        pid = context.get("last_product_id")
        if not pid: return self._handle_top_performing(session_id)

        p, inv, s = self._get_product(pid), self._get_inventory(pid), self._get_sales(pid)[0]
        if not p or not inv: return {"text": "Data produk tidak ditemukan.", "chart": None}

        # DYNAMIC FEATURE VECTOR (13 Features)
        now = datetime.now()
        f = [
            inv['stock_level'], s['units_sold'], s['units_ordered'],
            p['price'], p['discount'], p['competitor_price'],
            self.encoders.encode_category(p['category']),
            self.encoders.encode_region(inv['region']),
            self.encoders.encode_weather(p['weather']),
            self.encoders.encode_holiday(p['holiday']),
            self.encoders.encode_seasonality(p['seasonality']),
            now.month, now.weekday()
        ]

        pred = self.model.predict([f])[0]
        self.memory.update(session_id, last_forecast=pred)

        return {
            "text": f"Forecast untuk {p['name']}: {pred:.1f} unit. {self.reasoning.explain_forecast(pred, f)}",
            "chart": {
                "type": "line",
                "title": f"Demand Forecast: {p['name']}",
                "labels": ["Historical", "Forecast"],
                "datasets": [{"label": "Unit", "data": [s['units_sold'], pred]}]
            }
        }

    def _handle_inventory(self, session_id, context):
        pid = context.get("last_product_id")
        if not pid: return {"text": "Produk mana yang ingin Anda cek stoknya?", "chart": None}

        p, inv = self._get_product(pid), self._get_inventory(pid)
        forecast = context.get("last_forecast")

        if not forecast:
            self._handle_forecast(session_id, context)
            forecast = self.memory.get_context(session_id).get("last_forecast", 0)

        res = self.reasoning.get_reorder_logic(inv['stock_level'], forecast)
        return {
            "text": f"Status Stok {p['name']}: {inv['stock_level']} unit. {res}",
            "chart": {
                "type": "bar",
                "title": "Stok vs Forecast",
                "labels": ["Fisik", "Prediksi Demand"],
                "datasets": [{"label": "Unit", "data": [inv['stock_level'], forecast]}]
            }
        }
```

---

## 6. Project Stabilization Highlights

1.  **Dynamic ML Vectors**: Baris fitur ditarik secara _real-time_ dari Supabase (13 fitur lengkap).
2.  **True Aggregation**: Analisis produk terlaris kini berdasarkan total akumulasi, bukan baris tunggal.
3.  **Conversational Memory**: AI mengingat konteks produk terakhir (continuity) tanpa pengulangan nama.
4.  **Operational Reasoning**: Jawaban AI menyertakan alasan logis (Cuaca, Musim, Promo) dari data nyata.
5.  **Robust Backend**: Dilengkapi penanganan nilai kosong (_null handling_) dan format grafik yang konsisten.
