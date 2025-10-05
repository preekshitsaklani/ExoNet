# ExoNet
## AI-Powered Exoplanet Discovery with Explainable AI

**Deadline: October 6, 2025, 00:00 IST**

ExoNet v2.0 is a cutting-edge web application that classifies exoplanet candidates using machine learning and provides transparent, human-understandable explanations for its predictions using SHAP (SHapley Additive exPlanations).

---

## 🌟 Core Innovations

### 1. **Explainable AI (XAI) Engine**
- Integrated SHAP library identifies the top 5 features influencing each prediction
- Transforms AI from a "black box" into a trustworthy scientific assistant
- Visual impact indicators show how each feature affects the classification

### 2. **Cross-Mission Validation**
- Trained on Kepler mission data
- Validated on TESS mission candidates
- Demonstrates real-world applicability across different space missions

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | FastAPI + Python 3.9+ | High-performance API with automatic validation |
| **ML Model** | LightGBM + Scikit-learn | State-of-the-art exoplanet classification |
| **XAI Engine** | SHAP | Model explanation and interpretability |
| **Frontend** | Next.js 15 + TypeScript | Modern, responsive UI with server-side rendering |
| **UI Components** | Shadcn/UI + Tailwind CSS | Beautiful, accessible component library |
| **Deployment** | Heroku/Railway/Vercel | Fast, scalable cloud deployment |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Model files: `exonet_lgbm_model.joblib` and `exonet_scaler.joblib`

### Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Place your model files here
# - exonet_lgbm_model.joblib
# - exonet_scaler.joblib

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000
```

### Frontend Setup (2 minutes)
Open a different terminal window and point it to the root directory of the project
```bash
# if terminal is pointing some other file enter the following
cd path_to_your_cloned_repository

or

# if already in the project/backend folder enter the following command
cd ..
```


```bash
# From project root
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see ExoNet in action!

---

## 📁 Project Structure

```
exonet-v2/
├── backend/                    # FastAPI backend
│   ├── main.py                # Main API with SHAP integration
│   ├── requirements.txt       # Python dependencies
│   ├── exonet_lgbm_model.joblib    # LightGBM model (you provide)
│   ├── exonet_scaler.joblib        # Feature scaler (you provide)
│   ├── Procfile               # Heroku deployment config
│   └── README.md              # Backend documentation
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main ExoNet page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles with starfield
│   └── components/
│       └── ExoNetClassifier.tsx    # Main classification UI
├── DEPLOYMENT.md              # Comprehensive deployment guide
└── README.md                  # This file
```

---

## 🎯 Key Features

### For Users
- ✨ **Dynamic Form Generation**: Automatically generates input fields for all 20 exoplanet features
- 🎨 **Space-Themed UI**: Beautiful dark theme with animated starfield background
- 🚀 **One-Click Demo**: Load pre-filled TESS mission data with a single click
- 📊 **Visual Explanations**: See exactly which features influenced the prediction
- ⚡ **Real-Time Classification**: Get instant predictions with confidence scores

### For Developers
- 🔄 **Auto-Reloading**: FastAPI and Next.js hot reload during development
- 📝 **Type Safety**: Full TypeScript support with Pydantic models
- 🧪 **Interactive API Docs**: Swagger UI at `/docs` endpoint
- 🔌 **Easy Integration**: RESTful API with comprehensive endpoints
- 📦 **Production Ready**: Includes Heroku, Railway, and Vercel configs

---

## 🎮 How to Use

1. **Load Demo Data** (recommended for first use):
   - Click "Load TESS Demo Data" button
   - Form auto-fills with a TESS mission candidate

2. **Or Enter Manual Data**:
   - Fill in the 20 feature fields
   - Values can be found in Kepler or TESS data catalogs

3. **Classify**:
   - Click "Classify Exoplanet"
   - View the prediction (Planet or False Positive)
   - See confidence scores and probabilities

4. **Understand the Results**:
   - Switch to "Results" tab
   - Review the top 5 contributing features
   - See SHAP values and impact indicators

---

## 🔬 API Endpoints

### `GET /`
Health check endpoint
```json
{
  "message": "ExoNet API v2.0 - AI-Powered Exoplanet Discovery",
  "status": "operational",
  "model_loaded": true,
  "features_required": 20
}
```

### `GET /features`
Get list of required features
```json
{
  "features": ["koi_period", "koi_time0bk", ...],
  "count": 20
}
```

### `POST /predict`
Classify exoplanet candidate
```json
{
  "prediction": "CONFIRMED PLANET",
  "confidence": 94.32,
  "probability_planet": 94.32,
  "probability_false_positive": 5.68,
  "top_reasons": [
    {
      "feature": "koi_fpflag_nt",
      "feature_readable": "Fpflag Nt",
      "value": 0,
      "impact": "strongly increases",
      "shap_value": 0.4523,
      "importance": 0.4523
    },
    ...
  ]
}
```

### `GET /demo-data`
Get pre-filled TESS mission demo data

---

## 📊 Model Features

The model requires 20 features:

**Planetary Characteristics:**
- `koi_period`: Orbital period (days)
- `koi_prad`: Planetary radius (Earth radii)
- `koi_teq`: Equilibrium temperature (K)
- `koi_insol`: Insolation flux (Earth flux)

**Transit Characteristics:**
- `koi_time0bk`: Transit epoch (BKJD)
- `koi_impact`: Impact parameter
- `koi_duration`: Transit duration (hours)
- `koi_depth`: Transit depth (ppm)
- `koi_model_snr`: Signal-to-noise ratio

**Stellar Characteristics:**
- `koi_steff`: Stellar effective temperature (K)
- `koi_slogg`: Stellar surface gravity (log10)
- `koi_srad`: Stellar radius (Solar radii)
- `koi_kepmag`: Kepler magnitude

**Position:**
- `ra`: Right ascension (degrees)
- `dec`: Declination (degrees)

**False Positive Flags:**
- `koi_fpflag_nt`: Not transit-like flag
- `koi_fpflag_ss`: Stellar eclipse flag
- `koi_fpflag_co`: Centroid offset flag
- `koi_fpflag_ec`: Ephemeris match flag

**Additional:**
- `koi_tce_plnt_num`: Planet number in system

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

**Quick Deploy Options:**
- **Backend**: Heroku, Railway, Google Cloud Run, Render
- **Frontend**: Vercel, Netlify, GitHub Pages

---

## 🎓 Educational Value

ExoNet v2.0 demonstrates:
1. **Machine Learning in Production**: Real-world ML deployment patterns
2. **Explainable AI**: How to make AI decisions transparent
3. **Full-Stack Development**: Modern web application architecture
4. **API Design**: RESTful API best practices
5. **Scientific Computing**: Data science in a web application

---

## 🔮 Future Enhancements

- [ ] Add batch processing for multiple candidates
- [ ] Implement result history and comparison
- [ ] Add visualization of transit light curves
- [ ] Support for additional missions (K2, James Webb)
- [ ] Real-time data integration with NASA archives
- [ ] User authentication and saved predictions
- [ ] Interactive SHAP force plots
- [ ] Export results to PDF/CSV

---

## 📄 License

This project is created for educational and hackathon purposes.

---

## 🙏 Acknowledgments

- **NASA Kepler Mission**: Training data source
- **NASA TESS Mission**: Validation data source
- **SHAP Library**: Explainable AI framework
- **LightGBM**: High-performance gradient boosting
- **FastAPI**: Modern Python web framework
- **Next.js**: React framework for production

---

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Review API documentation at `/docs` endpoint
3. Ensure model files are in the `backend/` directory

---

## 🌟 Star This Project

If ExoNet v2.0 helps your project or learning journey, please give it a star! ⭐

**Built with ❤️ for the advancement of exoplanet science and AI transparency.**