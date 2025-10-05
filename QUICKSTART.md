# ⚡ ExoNet v2.0 - Quick Start Guide
## Get Up and Running in 10 Minutes

This guide will get your ExoNet v2.0 application running locally as fast as possible.

---

## 🎯 Prerequisites

- ✅ Node.js 18+ installed
- ✅ Python 3.9+ installed
- ✅ Your model files: `exonet_lgbm_model.joblib` and `exonet_scaler.joblib`

---

## 🏃 Step 1: Place Model Files (30 seconds)

```bash
# Copy your model files into the backend directory
cp /path/to/exonet_lgbm_model.joblib backend/
cp /path/to/exonet_scaler.joblib backend/
```

**⚠️ CRITICAL**: Without these files, the backend won't work!

---

## 🐍 Step 2: Start Backend (3 minutes)

Open a terminal:

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000
```

**✅ Success**: You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
✅ Model, scaler, and SHAP explainer loaded successfully!
```

**📚 Test it**: Visit `http://localhost:8000/docs` for interactive API docs!

---

## 🎨 Step 3: Start Frontend (2 minutes)

Open a **new** terminal:

```bash
# From project root
npm install

# Start Next.js development server
npm run dev
```

**✅ Success**: You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
✓ Ready in Xms
```

---

## 🎮 Step 4: Use ExoNet (2 minutes)

1. **Open Browser**: Navigate to `http://localhost:3000`

2. **Load Demo Data**: Click the "Load TESS Demo Data" button
   - This fills all 20 feature fields automatically

3. **Classify**: Click "Classify Exoplanet"
   - Wait 2-3 seconds for prediction

4. **View Results**: Switch to "Results" tab
   - See the prediction (Planet or False Positive)
   - View the top 5 SHAP explanations
   - Understand why the model made its decision

---

## 🎉 You're Running!

Your ExoNet v2.0 is now fully operational!

**What's happening:**
- ✨ Frontend: Beautiful space-themed UI at `localhost:3000`
- 🚀 Backend: FastAPI server with SHAP at `localhost:8000`
- 🧠 Model: LightGBM classifier making predictions
- 📊 XAI: SHAP explaining every decision

---

## 🛠️ Common Issues & Fixes

### Issue: "Model not loaded"
**Cause**: Model files not in `backend/` directory

**Fix**:
```bash
ls backend/*.joblib
# Should show both .joblib files
```

### Issue: Backend won't start - "ModuleNotFoundError"
**Cause**: Missing Python dependencies

**Fix**:
```bash
cd backend
pip install -r requirements.txt
```

### Issue: Frontend shows connection error
**Cause**: Backend not running

**Fix**:
```bash
# In backend terminal, verify server is running
# Should see: "Uvicorn running on http://127.0.0.1:8000"
```

### Issue: CORS error in browser console
**Cause**: Frontend and backend on different origins

**Fix**: This shouldn't happen locally, but if it does:
```python
# backend/main.py already has CORS enabled with allow_origins=["*"]
```

---

## 📱 Using the Application

### Manual Data Entry
Fill in any or all 20 fields:
- `koi_period`: Orbital period in days (e.g., 3.52)
- `koi_prad`: Planet radius in Earth radii (e.g., 1.85)
- `koi_steff`: Star temperature in Kelvin (e.g., 5778)
- ... and 17 more features

### Understanding Results

**Prediction Types:**
- 🟢 **CONFIRMED PLANET**: Model predicts this is a real exoplanet
- 🔴 **FALSE POSITIVE**: Model predicts this is NOT a planet

**Confidence Score:**
- Shows how certain the model is (0-100%)
- Higher = more confident

**SHAP Explanations:**
Each feature shows:
- **Rank**: Importance order (#1 = most important)
- **Value**: The actual input value
- **Impact**: How it affects the prediction
  - 🟢 "increases planet likelihood" = pushes toward PLANET
  - 🔴 "decreases planet likelihood" = pushes toward FALSE POSITIVE
- **Importance**: Numerical SHAP value (higher = more influential)

---

## 🚀 Next Steps

### Ready to Deploy?
See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Heroku deployment (free tier)
- Railway deployment (easiest)
- Vercel deployment (fastest)
- Google Cloud Run (scalable)

### Want to Customize?
- **Change API URL**: Edit `src/app/page.tsx`, line with `apiUrl` prop
- **Modify UI**: Edit `src/components/ExoNetClassifier.tsx`
- **Add Features**: Extend `backend/main.py` endpoints
- **Adjust Styling**: Edit `src/app/globals.css`

---

## ✅ Quick Validation Checklist

- [ ] Backend running at `http://localhost:8000`
- [ ] Frontend running at `http://localhost:3000`
- [ ] API docs accessible at `http://localhost:8000/docs`
- [ ] Demo data loads successfully
- [ ] Prediction returns results
- [ ] SHAP explanations display correctly
- [ ] No console errors in browser

---

## 🎯 Demo Script for Hackathon

**Perfect for presenting ExoNet v2.0:**

1. **Open Application**: "This is ExoNet v2.0, an AI-powered exoplanet classifier"

2. **Load Demo**: "I'll load a TESS mission candidate..." (click button)

3. **Classify**: "Let's classify it..." (click Classify button)

4. **Show Results**: "The AI predicts this is a [PLANET/FALSE POSITIVE] with X% confidence"

5. **Explain**: "But here's the innovation - we don't just predict, we EXPLAIN..."

6. **Show SHAP**: "These are the top 5 features that influenced this decision..."

7. **Highlight Feature**: "For example, the [feature name] with value [X] strongly [increases/decreases] the planet likelihood"

8. **Cross-Mission**: "And this demonstrates cross-mission capability - trained on Kepler, validated on TESS!"

---

## 💡 Pro Tips

1. **Keep both terminals open** during development
2. **API docs at `/docs`** are your friend for testing
3. **Demo data** is perfect for quick demonstrations
4. **Browser DevTools** show API calls and responses
5. **SHAP calculations** take 2-3 seconds - this is normal!

---

## 🎊 Congratulations!

You're now running a production-ready, explainable AI exoplanet classifier!

**Total setup time: ~10 minutes** ⏱️

Ready to discover exoplanets? 🚀🪐

---

**Need help?** Check the main [README.md](./README.md) for detailed documentation.