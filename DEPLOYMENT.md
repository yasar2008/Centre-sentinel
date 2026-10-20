# Kaushal-Drishti / Centre Sentinel — Production Cloud Deployment Guide
### Ministry of Skill Development and Entrepreneurship (MSDE Problem ID 26245)

This guide covers deploying the **Kaushal-Drishti (कौशल-दृष्टि)** platform to production cloud infrastructure.

---

## Architecture Overview

```
                      ┌───────────────────────────────────────────────┐
                      │              VERCEL / CLOUDFLARE              │
                      │   Next.js 14 App Router (Serverless / Edge)   │
                      │     - National Surveillance Camera Wall       │
                      │     - Real-Time Executive Cockpit             │
                      │     - AEBAS Biometric SQL Workbench           │
                      └───────────────────────┬───────────────────────┘
                                              │ HTTPS Uplink (<64 kbps)
                                              ▼
                      ┌───────────────────────────────────────────────┐
                      │             RENDER / RAILWAY / AWS            │
                      │        FastAPI Edge Agent (Python 3.11)       │
                      │     - YOLOv8n Headcount & Inventory Detector  │
                      │     - Gaussian Blur (k=51x51) Privacy Engine  │
                      │     - Spatial IoU Operability Index Engine    │
                      │     - SQLite ACID Relational Database         │
                      └───────────────────────────────────────────────┘
```

---

## 1. Push Repository to GitHub

Ensure your local repository is committed and pushed to GitHub:

```bash
# 1. Add all deployment configurations and assets
git add .

# 2. Create conventional commit
git commit -m "feat(deploy): add production cloud configurations for Vercel, Render, and Railway"

# 3. Create a new GitHub repository (e.g. 'kaushal-drishti' on https://github.com/new)
# Then link remote and push:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/kaushal-drishti.git
git branch -M main
git push -u origin main
```

---

## 2. Deploy Frontend to Vercel (Recommended)

Vercel is the native platform for Next.js 14 and deploys within 60 seconds with worldwide edge distribution.

### Option A: Via Vercel Web Dashboard (Zero CLI)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select the **`kaushal-drishti`** repository.
3. Configure Project:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select `frontend` (or leave default since root `vercel.json` is provided).
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Add Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`: `https://your-vercel-domain.vercel.app`
   - `EDGE_AGENT_URL`: `https://your-edge-agent.onrender.com` (or leave empty to run with autonomous high-fidelity edge cache)
5. Click **Deploy**.

### Option B: Via Vercel CLI
```bash
cd frontend
npx vercel --prod
```

---

## 3. Deploy Edge Backend to Render (Free Cloud Tier)

The edge agent runs FastAPI, OpenCV headless, Ultralytics YOLOv8n, and persistent SQLite.

### Option A: Using Render Blueprint (1-Click)
1. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
2. Click **New Blueprint Instance**.
3. Connect your GitHub repository.
4. Render will read `render.yaml` automatically and configure both the Python edge service and Next.js frontend!
5. Click **Apply**.

### Option B: As a Standalone Web Service on Render
1. Go to [dashboard.render.com](https://dashboard.render.com) -> **New** -> **Web Service**.
2. Connect repository:
   - **Root Directory**: `edge-agent`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
3. Environment Variables:
   - `PORT`: `10000`
   - `EDGE_NODE_ID`: `EDGE-NODE-MSDE-042`
   - `CENTRE_ID`: `TC-JH-RNC-081`
   - `LOW_BANDWIDTH_MODE`: `true`
   - `PYTHONUNBUFFERED`: `1`
4. Click **Create Web Service**.

---

## 4. Deploy Backend to Railway.app

1. Go to [railway.app/new](https://railway.app/new).
2. Click **Deploy from GitHub repo**.
3. Select `kaushal-drishti`.
4. Railway will automatically detect `railway.json` and `edge-agent/Procfile`.
5. Set the service **Root Directory** to `edge-agent` or let Railway run the start command specified in `railway.json`.
6. Add environment variable `PORT=8000`.
7. Generate a public Railway domain.

---

## 5. Local Production Mode (Offline / Evaluation Testing)

To run the exact optimized production bundle locally (bypassing development mode latency):

### Quickstart (Windows Batch)
Double-click:
```bash
start_production.bat
```

### Manual Commands
In Terminal 1 (Edge Agent):
```bash
cd edge-agent
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

In Terminal 2 (Frontend Dashboard):
```bash
cd frontend
npm run build
npm run start
```

Access:
- **Dashboard**: `http://localhost:3000`
- **Edge API & Swagger**: `http://localhost:8000/docs`
