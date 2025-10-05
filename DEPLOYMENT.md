# ExoNet v2.0 - Deployment Guide 🚀

This guide provides step-by-step instructions for deploying both the FastAPI backend and Next.js frontend.

---

## 📋 Pre-Deployment Checklist

- [ ] Model files (`exonet_lgbm_model.joblib` and `exonet_scaler.joblib`) are in the `backend/` directory
- [ ] Backend tested locally at `http://localhost:8000`
- [ ] Frontend tested locally at `http://localhost:3000`
- [ ] All dependencies are listed in `requirements.txt` and `package.json`

---

## 🔧 Backend Deployment

### Option 1: Heroku (Free Tier Available)

#### Step 1: Setup Heroku
```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# or download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login
```

#### Step 2: Create Heroku App
```bash
cd backend
heroku create exonet-api-2025
```

#### Step 3: Add Model Files
```bash
# IMPORTANT: Ensure your model files are tracked
git lfs track "*.joblib"  # If using Git LFS
# or
git add exonet_lgbm_model.joblib exonet_scaler.joblib
```

#### Step 4: Set Python Buildpack
```bash
heroku buildpacks:set heroku/python
```

#### Step 5: Deploy
```bash
git add .
git commit -m "Deploy ExoNet API to Heroku"
git push heroku main
```

#### Step 6: Verify Deployment
```bash
heroku open
# Visit: https://exonet-api-2025.herokuapp.com/docs
```

---

### Option 2: Google Cloud Run

#### Step 1: Install Google Cloud CLI
```bash
# macOS
brew install --cask google-cloud-sdk

# Initialize
gcloud init
```

#### Step 2: Create Dockerfile
```dockerfile
# Create backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

#### Step 3: Deploy to Cloud Run
```bash
cd backend

gcloud run deploy exonet-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 60
```

#### Step 4: Get the URL
```bash
gcloud run services describe exonet-api --region us-central1 --format 'value(status.url)'
```

---

### Option 3: Railway.app (Recommended for Hackathons)

#### Step 1: Create Railway Account
- Visit [Railway.app](https://railway.app)
- Sign up with GitHub

#### Step 2: New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects Python app

#### Step 3: Configure
1. Go to project settings
2. Add environment variables (if needed)
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Step 4: Deploy
- Railway automatically deploys on git push
- Get your public URL from dashboard

---

### Option 4: Render.com

#### Step 1: Create Account
- Visit [Render.com](https://render.com)
- Sign up with GitHub

#### Step 2: New Web Service
1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: exonet-api
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Step 3: Deploy
- Render automatically builds and deploys
- Free tier includes SSL certificate

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Update API URL
```typescript
// src/app/page.tsx
<ExoNetClassifier apiUrl="https://your-backend-url.herokuapp.com" />
```

#### Step 2: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 3: Deploy
```bash
# From project root
vercel login
vercel deploy

# For production
vercel --prod
```

#### Alternative: GitHub Integration
1. Visit [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings (auto-detected for Next.js)
4. Deploy!

---

### Option 2: Netlify

#### Step 1: Update API URL
```typescript
// src/app/page.tsx
<ExoNetClassifier apiUrl="https://your-backend-url.railway.app" />
```

#### Step 2: Build Settings
```bash
# Build command
npm run build

# Publish directory
.next
```

#### Step 3: Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

### Option 3: GitHub Pages (Static Export)

#### Step 1: Update next.config.ts
```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

#### Step 2: Build and Deploy
```bash
npm run build
npx gh-pages -d out
```

---

## 🔒 Environment Variables

### Backend (.env)
```bash
# Optional: If you need to restrict CORS
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app

# Optional: Custom port (Heroku sets automatically)
PORT=8000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
```

Then update:
```typescript
// src/app/page.tsx
<ExoNetClassifier apiUrl={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"} />
```

---

## 🧪 Testing Deployed API

### Using curl
```bash
# Health check
curl https://your-api-url.herokuapp.com/

# Get features list
curl https://your-api-url.herokuapp.com/features

# Get demo data
curl https://your-api-url.herokuapp.com/demo-data

# Make prediction
curl -X POST https://your-api-url.herokuapp.com/predict \
  -H "Content-Type: application/json" \
  -d @demo_data.json
```

### Using Python
```python
import requests

# Make prediction
response = requests.post(
    "https://your-api-url.herokuapp.com/predict",
    json={
        "koi_period": 3.5234,
        "koi_time0bk": 131.5,
        # ... all other features
    }
)

print(response.json())
```

---

## 📊 Monitoring & Logs

### Heroku
```bash
# View logs
heroku logs --tail --app exonet-api-2025

# Check status
heroku ps --app exonet-api-2025
```

### Google Cloud Run
```bash
# View logs
gcloud run logs read exonet-api --region us-central1
```

### Railway
- View logs in the Railway dashboard
- Real-time log streaming available

---

## 🚨 Troubleshooting

### Model Files Too Large
**Problem**: Git rejects files > 100MB

**Solution**: Use Git LFS
```bash
git lfs install
git lfs track "*.joblib"
git add .gitattributes
git add backend/*.joblib
git commit -m "Add model files via LFS"
```

### CORS Issues
**Problem**: Frontend can't connect to backend

**Solution**: Update CORS settings in `backend/main.py`
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-url.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Memory Issues
**Problem**: Backend crashes on prediction

**Solution**: Increase memory allocation
- **Heroku**: Upgrade to Hobby tier (512MB RAM)
- **Cloud Run**: Add `--memory 2Gi` flag
- **Railway**: Upgrade plan for more resources

### Cold Start Issues
**Problem**: First request is slow

**Solution**: Implement health check pings
- Use a service like UptimeRobot to ping your API every 5 minutes
- Keeps the server warm and responsive

---

## 🎯 Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API URL updated in frontend code
- [ ] CORS configured correctly
- [ ] Model files uploaded successfully
- [ ] Health check endpoint returning 200
- [ ] Demo data loading correctly
- [ ] Prediction endpoint working
- [ ] SHAP explanations generating
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (optional)
- [ ] Monitoring/logging enabled

---

## 🌐 Custom Domains (Optional)

### Heroku
```bash
heroku domains:add api.exonet.com --app exonet-api-2025
```

### Vercel
1. Go to project settings
2. Add custom domain
3. Update DNS records

---

## 📈 Scaling Considerations

For production use:
1. **Add caching**: Redis for frequently requested predictions
2. **Queue system**: Celery for batch processing
3. **Load balancing**: Multiple backend instances
4. **Database**: PostgreSQL for storing predictions
5. **CDN**: CloudFlare for frontend assets

---

## 🎉 You're Live!

Your ExoNet v2.0 application is now deployed and ready to classify exoplanets!

**Share your deployment:**
- Frontend: `https://your-app.vercel.app`
- API Docs: `https://your-api.herokuapp.com/docs`

**Test the demo:**
1. Visit your frontend URL
2. Click "Load TESS Demo Data"
3. Click "Classify Exoplanet"
4. See the SHAP explanations!

---

## 📞 Need Help?

Common deployment resources:
- [Heroku Python Docs](https://devcenter.heroku.com/articles/getting-started-with-python)
- [Vercel Next.js Guide](https://vercel.com/docs/frameworks/nextjs)
- [Railway Docs](https://docs.railway.app/)
- [Google Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts)

**Good luck with your deployment! 🚀🪐**