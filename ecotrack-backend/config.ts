// Environment configuration for EcoTrack Backend
export const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // Server configuration
  PORT: parseInt(process.env.PORT || "3000"),
  
  // Frontend URLs
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  FRONTEND_URL_PROD: process.env.FRONTEND_URL_PROD || "https://ecotrack-frontend-tzew.onrender.com",
  
  // Backend URLs
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000",
  BACKEND_URL_PROD: process.env.BACKEND_URL_PROD || "https://ecotrack-backend-8x8h.onrender.com",
  
  // CORS configuration
  CORS_ORIGINS: process.env.CORS_ORIGINS || 
    `${process.env.FRONTEND_URL || "http://localhost:5173"},${process.env.FRONTEND_URL_PROD || "https://your-frontend-app.onrender.com"}`,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production",
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/ecotrack",
  
  // Helper functions
  getCurrentFrontendUrl: () => {
    return config.NODE_ENV === 'production' ? config.FRONTEND_URL_PROD : config.FRONTEND_URL;
  },
  
  getCurrentBackendUrl: () => {
    return config.NODE_ENV === 'production' ? config.BACKEND_URL_PROD : config.BACKEND_URL;
  },
  
  getAllowedOrigins: () => {
    return config.CORS_ORIGINS.split(',').map(url => url.trim());
  }
};

export default config;
