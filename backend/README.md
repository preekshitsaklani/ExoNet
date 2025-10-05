# ExoNet Backend API

## Setup Instructions

### 1. Place Model Files
Copy your model files into this `backend/` directory:
- `exonet_lgbm_model.joblib`
- `exonet_scaler.joblib`

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Run the Server Locally
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### 4. Test the API
Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## API Endpoints

- `GET /` - Health check
- `GET /features` - Get list of required features
- `POST /predict` - Classify exoplanet candidate with SHAP explanations
- `GET /demo-data` - Get pre-filled TESS mission demo data

## Deployment Options

### Option 1: Heroku
```bash
# Install Heroku CLI, then:
heroku create exonet-api
heroku buildpacks:set heroku/python
git push heroku main
```

### Option 2: Google Cloud Run
```bash
# Build and deploy:
gcloud run deploy exonet-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 3: Railway.app
1. Connect your GitHub repository
2. Railway will auto-detect the Python app
3. Add environment variables if needed
4. Deploy!

## Environment Variables (Optional)
- `PORT` - Server port (default: 8000)
- `ALLOWED_ORIGINS` - CORS origins (default: *)