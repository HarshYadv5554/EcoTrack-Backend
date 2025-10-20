# EcoTrack Deployment Guide

This guide will help you deploy the EcoTrack application on Render with separate frontend and backend deployments.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Set up a PostgreSQL database (can use Render's managed PostgreSQL)

## Step 1: Deploy Backend (Web Service)

### 1.1 Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `ecotrack-backend` folder

### 1.2 Configure Backend Settings

**Basic Settings:**
- **Name**: `ecotrack-backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Environment Variables:**
```
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-app.onrender.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://your-frontend-app.onrender.com
```

### 1.3 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the backend URL (e.g., `https://ecotrack-backend.onrender.com`)

## Step 2: Deploy Frontend (Static Site)

### 2.1 Create New Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Select the `ecotrack-frontend` folder

### 2.2 Configure Frontend Settings

**Basic Settings:**
- **Name**: `ecotrack-frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**Environment Variables:**
```
VITE_API_BASE_URL=https://ecotrack-backend.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_APP_NAME=EcoTrack
VITE_APP_VERSION=1.0.0
```

### 2.3 Deploy Frontend

1. Click "Create Static Site"
2. Wait for deployment to complete
3. Note the frontend URL (e.g., `https://ecotrack-frontend.onrender.com`)

## Step 3: Update CORS Configuration

After both deployments are complete:

1. Go to your backend service on Render
2. Update the `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://ecotrack-frontend.onrender.com
   ```
3. Redeploy the backend

## Step 4: Set Up Database

### Option A: Render Managed PostgreSQL

1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure database settings
4. Copy the connection string to your backend's `DATABASE_URL`

### Option B: External Database

Use any PostgreSQL provider (Neon, Supabase, etc.) and update the `DATABASE_URL` in your backend environment variables.

## Step 5: Test Deployment

1. Visit your frontend URL
2. Try signing up and logging in
3. Test waste reporting
4. Test like and comment functionality

## Environment Variables Summary

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-app.onrender.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://your-frontend-app.onrender.com
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-app.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_APP_NAME=EcoTrack
VITE_APP_VERSION=1.0.0
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `CORS_ORIGINS` includes your frontend URL
2. **Database Connection**: Verify `DATABASE_URL` is correct
3. **Build Failures**: Check that all dependencies are in package.json
4. **Environment Variables**: Ensure all required variables are set

### Logs:
- Check Render logs for backend issues
- Use browser developer tools for frontend issues

## File Structure

```
ecotrack-backend/          # Backend deployment
├── package.json
├── tsconfig.json
├── index.ts
├── config.ts
├── lib/
├── routes/
└── README.md

ecotrack-frontend/         # Frontend deployment
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
├── client/
├── public/
└── README.md
```

## Next Steps

After successful deployment:

1. Set up custom domains (optional)
2. Configure SSL certificates (automatic on Render)
3. Set up monitoring and alerts
4. Configure backup strategies for your database
