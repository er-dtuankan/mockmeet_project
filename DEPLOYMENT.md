# 🚀 MockMeet Deployment Guide
## Node.js + Express + MongoDB (Render/Atlas) & React + Vite (Vercel)

This guide walks you through deploying the full-stack database and token-driven MockMeet codebase.

---

## Part 1: MongoDB Database Setup (MongoDB Atlas)

### Step 1 — Create a Free Database Cluster
1. Sign up/Login to **https://www.mongodb.com/cloud/atlas**.
2. Click **"Create a Database"** and select the **M0 Free Shared Tier**.
3. Choose a cloud provider (e.g., AWS) and region nearest to you, then click **"Create"**.

### Step 2 — Configure Database Access Credentials
1. Under **Database Access**, create a database user:
   - Choose a Username (e.g., `mockmeet_admin`).
   - Securely generate/type a Password.
   - Assign the **Read and write to any database** privilege.
2. Under **Network Access**, click **"Add IP Address"**:
   - Choose **"Allow Access from Anywhere"** (`0.0.0.0/0`) so Render's cloud servers can connect.
   - Click **"Confirm"**.

### Step 3 — Retrieve the Connection String
1. Navigate to your Database Deployment Dashboard and click **"Connect"**.
2. Select **"Drivers"** (Node.js).
3. Copy the Connection String (looks like `mongodb+srv://mockmeet_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`).
4. Replace `<password>` with your created database user password. Note this string for Part 2.

---

## Part 2: Deploy Backend API to Render

### Step 1 — Initialize Git and Push to GitHub
If you haven't initialized your Git repository:
```bash
git init
git add .
git commit -m "feat: MockMeet Node + Express + Mongoose custom DB setup"
# Add your remote origin and push to main/master branch
git branch -M main
git remote add origin your_github_repo_url
git push -u origin main
```

### Step 2 — Create Web Service on Render
1. Go to **https://render.com** and sign up/login.
2. Click **"New +"** → **"Web Service"**.
3. Link your GitHub account and select your project repository.
4. Configure:
   - **Name**: `mockmeet-backend-api`
   - **Root Directory**: `backend` (very important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Select the **Free Tier**.

### Step 3 — Configure Environment Variables
In the Render Web Service dashboard, navigate to the **"Environment"** tab and click **"Add Environment Variable"**:

| Key | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Enables production response behavior |
| `MONGO_URI` | `mongodb+srv://...` | Paste your MongoDB connection string from Part 1 |
| `JWT_SECRET` | `generate_some_long_random_alphanumeric_string_key` | Secret key used to encrypt and verify user JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `FRONTEND_URL` | `https://your-frontend-domain.vercel.app` | Leave blank or set to your Vercel URL once deployed |

Click **"Save Changes"**. Render will deploy. Once successful, copy the live URL (e.g., `https://mockmeet-backend-api.onrender.com`).

---

## Part 3: Deploy Frontend App to Vercel

### Step 1 — Import Project on Vercel
1. Go to **https://vercel.com** and sign up/login.
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository.
4. Configure:
   - **Framework Preset**: `Vite` (Vercel will auto-detect it based on our configurations)
   - **Root Directory**: `frontend` (very important! Do not build from root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2 — Configure Environment Variables
Expand the **Environment Variables** section and add:

| Key | Value |
|---|---|
| `VITE_BACKEND_URL` | `https://mockmeet-backend-api.onrender.com/api/v1` |

Click **"Deploy"**. Vercel will build and assign you a live hosting domain (e.g., `https://mockmeet.vercel.app`).

### Step 3 — Finalize CORS Integration
1. Go back to your Render Dashboard (backend web service).
2. Go to the **"Environment"** tab.
3. Update `FRONTEND_URL` to match your Vercel domain: `https://mockmeet.vercel.app`.
4. Save Changes to trigger a dynamic redeployment.

---

## Local Development Execution

### Terminal 1: Backend API Server
```bash
cd backend
# Create .env and update MONGO_URI, JWT_SECRET, PORT
copy .env.example .env
npm run dev
# Running on http://localhost:5000
```

### Terminal 2: React Frontend App
```bash
cd frontend
# Create .env.local and verify VITE_BACKEND_URL is directed to http://localhost:5000/api/v1
copy .env.example .env.local
npm run dev
# Running on http://localhost:5173
```
