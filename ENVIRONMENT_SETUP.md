# Environment Setup for EcoTrack

This guide explains how to configure environment variables for both frontend and backend deployment on Render.

## Backend Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Environment Configuration
NODE_ENV=development

# Frontend URL Configuration
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_PROD=https://your-frontend-app.onrender.com

# Backend Configuration
PORT=3000
BACKEND_URL=http://localhost:3000
BACKEND_URL_PROD=https://your-backend-app.onrender.com

# Database Configuration (if needed)
# DATABASE_URL=postgresql://username:password@localhost:5432/ecotrack

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,https://your-frontend-app.onrender.com
```

## Frontend Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Base URL for production
VITE_API_BASE_URL=https://your-backend-app.onrender.com

# Google Maps API Key (if needed)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# App Configuration
VITE_APP_NAME=EcoTrack
VITE_APP_VERSION=1.0.0
```

## Render Deployment Configuration

### Backend Service on Render

1. **Environment Variables to set in Render Dashboard:**
   ```
   NODE_ENV=production
   FRONTEND_URL_PROD=https://your-frontend-app.onrender.com
   BACKEND_URL_PROD=https://your-backend-app.onrender.com
   CORS_ORIGINS=https://your-frontend-app.onrender.com
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`

### Frontend Service on Render

1. **Environment Variables to set in Render Dashboard:**
   ```
   VITE_API_BASE_URL=https://your-backend-app.onrender.com
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

2. **Build Command:** `npm run build`
3. **Publish Directory:** `dist/spa`

## Development Setup

1. **Backend Development:**
   ```bash
   cd server
   npm run dev
   ```

2. **Frontend Development:**
   ```bash
   npm run dev
   ```

3. **Full Stack Development:**
   ```bash
   npm run dev:full
   ```

## CORS Configuration

The backend is configured to allow requests from:
- Development: `http://localhost:5173`
- Production: Your frontend URL on Render

The CORS configuration automatically switches between development and production URLs based on the `NODE_ENV` environment variable.

## Health Check

You can check if the backend is properly configured by visiting:
- Development: `http://localhost:3000/ping`
- Production: `https://your-backend-app.onrender.com/ping`

The health check will return information about the current configuration including CORS origins and frontend URL.

## Troubleshooting

### CORS Issues
- Ensure the frontend URL is included in the `CORS_ORIGINS` environment variable
- Check that the backend is reading the correct environment variables
- Verify the frontend is using the correct API base URL

### Environment Variable Issues
- Make sure `.env` files are in the correct directories
- Verify that environment variables are set in the Render dashboard
- Check that variable names match exactly (case-sensitive)

### API Connection Issues
- Verify the `VITE_API_BASE_URL` is set correctly for production
- Check that the backend URL is accessible
- Ensure both services are deployed and running
