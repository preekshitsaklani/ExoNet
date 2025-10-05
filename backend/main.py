from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
import numpy as np
from typing import List, Dict
import os
import sys

app = FastAPI(title="ExoNet API", version="2.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model, scaler, and explainer
model = None
scaler = None
explainer = None
feature_names = None

# Define the exact feature names expected by the model
FEATURE_NAMES = [
    "koi_period", "koi_time0bk", "koi_impact", "koi_duration", "koi_depth",
    "koi_prad", "koi_teq", "koi_insol", "koi_model_snr", "koi_tce_plnt_num",
    "koi_steff", "koi_slogg", "koi_srad", "ra", "dec", "koi_kepmag",
    "koi_fpflag_nt", "koi_fpflag_ss", "koi_fpflag_co", "koi_fpflag_ec"
]

class ExoplanetFeatures(BaseModel):
    koi_period: float
    koi_time0bk: float
    koi_impact: float
    koi_duration: float
    koi_depth: float
    koi_prad: float
    koi_teq: float
    koi_insol: float
    koi_model_snr: float
    koi_tce_plnt_num: float
    koi_steff: float
    koi_slogg: float
    koi_srad: float
    ra: float
    dec: float
    koi_kepmag: float
    koi_fpflag_nt: int
    koi_fpflag_ss: int
    koi_fpflag_co: int
    koi_fpflag_ec: int

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    probability_planet: float
    probability_false_positive: float
    top_reasons: List[Dict[str, any]]

@app.on_event("startup")
async def load_model():
    """Load model, scaler, and create SHAP explainer on startup"""
    global model, scaler, explainer, feature_names
    
    try:
        # Get the directory where this script is located
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "exonet_lgbm_model.joblib")
        scaler_path = os.path.join(base_dir, "exonet_scaler.joblib")
        
        print(f"\n{'='*60}")
        print(f"🔍 Looking for model files in: {base_dir}")
        print(f"{'='*60}")
        print(f"Model path: {model_path}")
        print(f"Model exists: {os.path.exists(model_path)}")
        print(f"Scaler path: {scaler_path}")
        print(f"Scaler exists: {os.path.exists(scaler_path)}")
        print(f"{'='*60}\n")
        
        if not os.path.exists(model_path):
            print(f"❌ ERROR: Model file not found at {model_path}")
            print(f"⚠️  Please place 'exonet_lgbm_model.joblib' in the backend/ directory")
            return
        
        if not os.path.exists(scaler_path):
            print(f"❌ ERROR: Scaler file not found at {scaler_path}")
            print(f"⚠️  Please place 'exonet_scaler.joblib' in the backend/ directory")
            return
        
        # Load the model and scaler
        print("📦 Loading model...")
        model = joblib.load(model_path)
        print("✅ Model loaded successfully!")
        
        print("📦 Loading scaler...")
        scaler = joblib.load(scaler_path)
        print("✅ Scaler loaded successfully!")
        
        # Create SHAP explainer for tree-based model
        print("🧠 Creating SHAP explainer...")
        explainer = shap.TreeExplainer(model)
        print("✅ SHAP explainer created successfully!")
        
        feature_names = FEATURE_NAMES
        
        print(f"\n{'='*60}")
        print("✅ ALL SYSTEMS READY!")
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"❌ CRITICAL ERROR loading model: {str(e)}")
        print(f"{'='*60}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {str(e)}")
        import traceback
        traceback.print_exc()
        print(f"{'='*60}\n")
        print("⚠️  INSTRUCTIONS:")
        print("1. Make sure 'exonet_lgbm_model.joblib' is in the backend/ directory")
        print("2. Make sure 'exonet_scaler.joblib' is in the backend/ directory")
        print("3. Restart the server after adding the files")
        print(f"{'='*60}\n")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "ExoNet API v2.0 - AI-Powered Exoplanet Discovery",
        "status": "operational",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "explainer_loaded": explainer is not None,
        "features_required": len(FEATURE_NAMES),
        "ready_for_predictions": model is not None and scaler is not None and explainer is not None
    }

@app.get("/features")
async def get_features():
    """Get list of required features"""
    return {
        "features": FEATURE_NAMES,
        "count": len(FEATURE_NAMES)
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(features: ExoplanetFeatures):
    """
    Classify an exoplanet candidate and explain the prediction
    """
    print(f"\n{'='*60}")
    print("🚀 Received prediction request")
    print(f"{'='*60}")
    
    if model is None or scaler is None or explainer is None:
        error_msg = "Model not loaded. Please ensure model files (exonet_lgbm_model.joblib and exonet_scaler.joblib) are in the backend/ directory and restart the server."
        print(f"❌ ERROR: {error_msg}")
        print(f"Model loaded: {model is not None}")
        print(f"Scaler loaded: {scaler is not None}")
        print(f"Explainer loaded: {explainer is not None}")
        print(f"{'='*60}\n")
        raise HTTPException(
            status_code=503,
            detail=error_msg
        )
    
    try:
        # Convert input to DataFrame
        input_dict = features.dict()
        print(f"📊 Input data received: {len(input_dict)} features")
        
        input_df = pd.DataFrame([input_dict], columns=FEATURE_NAMES)
        print(f"✅ DataFrame created with shape: {input_df.shape}")
        
        # Scale the features
        print("⚙️  Scaling features...")
        scaled_features = scaler.transform(input_df)
        scaled_df = pd.DataFrame(scaled_features, columns=FEATURE_NAMES)
        print("✅ Features scaled successfully")
        
        # Make prediction
        print("🔮 Making prediction...")
        prediction = model.predict(scaled_df)[0]
        prediction_proba = model.predict_proba(scaled_df)[0]
        print(f"✅ Prediction: {prediction} (probabilities: {prediction_proba})")
        
        # Calculate SHAP values for explainability
        print("🧠 Calculating SHAP values...")
        shap_values = explainer.shap_values(scaled_df)
        
        # Handle binary classification SHAP values
        if isinstance(shap_values, list):
            # For binary classification, take the positive class (index 1)
            shap_values_class = shap_values[1][0]
        else:
            shap_values_class = shap_values[0]
        
        print("✅ SHAP values calculated")
        
        # Get top 5 features by absolute SHAP value
        feature_importance = []
        for i, (feature_name, shap_value, original_value) in enumerate(
            zip(FEATURE_NAMES, shap_values_class, input_df.values[0])
        ):
            feature_importance.append({
                "feature": feature_name,
                "shap_value": float(shap_value),
                "original_value": float(original_value),
                "abs_impact": abs(float(shap_value))
            })
        
        # Sort by absolute impact and get top 5
        top_features = sorted(feature_importance, key=lambda x: x["abs_impact"], reverse=True)[:5]
        
        # Create human-readable reasons
        top_reasons = []
        for feat in top_features:
            impact_direction = "increases" if feat["shap_value"] > 0 else "decreases"
            impact_magnitude = "strongly" if feat["abs_impact"] > 0.1 else "moderately"
            
            reason = {
                "feature": feat["feature"],
                "feature_readable": feat["feature"].replace("koi_", "").replace("_", " ").title(),
                "value": round(feat["original_value"], 4),
                "impact": f"{impact_magnitude} {impact_direction}",
                "shap_value": round(feat["shap_value"], 4),
                "importance": round(feat["abs_impact"], 4)
            }
            top_reasons.append(reason)
        
        # Prepare response
        prediction_label = "CONFIRMED PLANET" if prediction == 1 else "FALSE POSITIVE"
        confidence = float(max(prediction_proba) * 100)
        
        print(f"✅ Prediction complete: {prediction_label} ({confidence:.2f}% confidence)")
        print(f"{'='*60}\n")
        
        return PredictionResponse(
            prediction=prediction_label,
            confidence=round(confidence, 2),
            probability_planet=round(float(prediction_proba[1] * 100), 2),
            probability_false_positive=round(float(prediction_proba[0] * 100), 2),
            top_reasons=top_reasons
        )
        
    except Exception as e:
        print(f"❌ ERROR during prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        print(f"{'='*60}\n")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )

@app.get("/demo-data")
async def get_demo_data():
    """
    Get pre-filled demo data from TESS mission candidate
    This demonstrates cross-mission applicability
    """
    # TOI-700 d - Confirmed Earth-sized planet in habitable zone
    demo_candidate = {
        "name": "TOI-700 d (TESS Confirmed Planet)",
        "mission": "TESS",
        "description": "Earth-sized planet in the habitable zone of its star",
        "features": {
            "koi_period": 37.4242,
            "koi_time0bk": 1570.0,
            "koi_impact": 0.34,
            "koi_duration": 3.65,
            "koi_depth": 287.5,
            "koi_prad": 1.19,
            "koi_teq": 268.8,
            "koi_insol": 0.867,
            "koi_model_snr": 42.3,
            "koi_tce_plnt_num": 3.0,
            "koi_steff": 3480.0,
            "koi_slogg": 4.95,
            "koi_srad": 0.415,
            "ra": 103.0886,
            "dec": -65.1436,
            "koi_kepmag": 9.75,
            "koi_fpflag_nt": 0,
            "koi_fpflag_ss": 0,
            "koi_fpflag_co": 0,
            "koi_fpflag_ec": 0
        }
    }
    
    return demo_candidate

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)