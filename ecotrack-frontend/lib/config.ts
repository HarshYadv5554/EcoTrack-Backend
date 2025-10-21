// Frontend configuration
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "/api" : "https://ecotrack-backend-8x8h.onrender.com"),
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "EcoTrack",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  
  // Google Maps Configuration
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  
  // Environment
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  
  // Helper functions
  getApiUrl: (endpoint: string) => {
    const baseUrl = config.API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  },
  
  // Log configuration for debugging
  logConfig: () => {
    if (config.IS_DEV) {
      console.log('Frontend Configuration:', {
        API_BASE_URL: config.API_BASE_URL,
        APP_NAME: config.APP_NAME,
        APP_VERSION: config.APP_VERSION,
        IS_DEV: config.IS_DEV,
        IS_PROD: config.IS_PROD,
      });
    }
  }
};

// Log configuration in development
if (config.IS_DEV) {
  config.logConfig();
}

export default config;
