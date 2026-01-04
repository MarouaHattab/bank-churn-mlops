from fastapi import FastAPI, HTTPException, Security, Depends
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import joblib
import numpy as np
import logging
import os
import traceback

from opencensus.ext.azure.log_exporter import AzureLogHandler
from app.models import CustomerFeatures, PredictionResponse, HealthResponse
from app.drift_detect import detect_drift
from functools import lru_cache
import hashlib
import json

# -------------------------------------------------
# Logging & Application Insights
# -------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bank-churn-api")

APPINSIGHTS_CONN = os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING")
if APPINSIGHTS_CONN:
    logger.addHandler(AzureLogHandler(connection_string=APPINSIGHTS_CONN))
    logger.info("Application Insights connecté")
else:
    logger.warning("Application Insights non configuré")

# -------------------------------------------------
# Initialisation FastAPI
# -------------------------------------------------
app = FastAPI(
    title="Bank Churn Prediction API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Sécurité - API Key
# -------------------------------------------------
API_KEY = os.getenv("API_KEY", "mlops_secret_key_2026")
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(
        status_code=403,
        detail="Clé API invalide ou manquante"
    )

# -------------------------------------------------
# Chargement du modèle
# -------------------------------------------------
MODEL_PATH = os.getenv("MODEL_PATH", "model/churn_model.pkl")
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        model = joblib.load(MODEL_PATH)
        logger.info(f"Modèle chargé depuis {MODEL_PATH}")
    except Exception as e:
        logger.error(f"Erreur chargement modèle : {e}")
        model = None

# -------------------------------------------------
# Endpoints généraux
# -------------------------------------------------
@app.get("/", tags=["General"])
def root():
    """Endpoint racine - Info API"""
    return {
        "message": "Bank Churn Prediction API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health", response_model=HealthResponse)
def health(api_key: str = Depends(get_api_key)):
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")
    return {"status": "healthy", "model_loaded": True}

# -------------------------------------------------
# Caching & Utils
# -------------------------------------------------
def hash_features(features_dict: dict) -> str:
    """Cree un hash unique pour les features"""
    return hashlib.md5(
        json.dumps(features_dict, sort_keys=True).encode()
    ).hexdigest()

@lru_cache(maxsize=1000)
def predict_cached(features_hash: str, features_json: str):
    """Fonction de prediction mise en cache"""
    features_dict = json.loads(features_json)
    
    # Preparation des donnees pour le modele
    X = np.array([[ 
        features_dict["CreditScore"],
        features_dict["Age"],
        features_dict["Tenure"],
        features_dict["Balance"],
        features_dict["NumOfProducts"],
        features_dict["HasCrCard"],
        features_dict["IsActiveMember"],
        features_dict["EstimatedSalary"],
        features_dict["Geography_Germany"],
        features_dict["Geography_Spain"]
    ]])
    
    # Prediction
    proba = model.predict_proba(X)[0][1]
    prediction = int(proba > 0.5)
    risk = "Low" if proba < 0.3 else "Medium" if proba < 0.7 else "High"
    
    return {
        "churn_probability": round(float(proba), 4),
        "prediction": prediction,
        "risk_level": risk
    }

# -------------------------------------------------
# Prédiction
# -------------------------------------------------
@app.post("/predict", response_model=PredictionResponse)
def predict(features: CustomerFeatures, api_key: str = Depends(get_api_key)):
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle indisponible")

    try:
        # On utilise model_dump() pour Pydantic V2
        features_dict = features.model_dump()
        features_hash = hash_features(features_dict)
        features_json = json.dumps(features_dict)
        
        # Utilise le cache si disponible
        result = predict_cached(features_hash, features_json)
        
        logger.info(
            "prediction",
            extra={
                "custom_dimensions": {
                    "event_type": "prediction",
                    "features_hash": features_hash,
                    "probability": result["churn_probability"],
                    "risk_level": result["risk_level"]
                }
            }
        )
        
        return result

    except Exception as e:
        logger.error(f"Erreur prediction : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------
# Drift Detection (API)
# -------------------------------------------------
@app.post("/drift/check", tags=["Monitoring"])
def check_drift(threshold: float = 0.05, api_key: str = Depends(get_api_key)):
    try:
        results = detect_drift(
            reference_file="data/bank_churn.csv",
            production_file="data/production_data.csv",
            threshold=threshold
        )

        drifted = [f for f, r in results.items() if r["drift_detected"]]
        drift_pct = len(drifted) / len(results) * 100

        logger.info(
            "drift_detection",
            extra={
                "custom_dimensions": {
                    "event_type": "drift_detection",
                    "features_analyzed": len(results),
                    "features_drifted": len(drifted),
                    "drift_percentage": drift_pct,
                    "risk_level": "HIGH" if drift_pct > 50 else "MEDIUM" if drift_pct > 20 else "LOW"
                }
            }
        )

        return {
            "status": "success",
            "features_analyzed": len(results),
            "features_drifted": len(drifted)
        }

    except Exception:
        tb = traceback.format_exc()
        logger.error(tb)
        raise HTTPException(status_code=500, detail="Erreur drift detection")