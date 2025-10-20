# EcoTrack Frontend

Frontend application for the EcoTrack waste management platform.

## Environment Variables

Copy `env.example` to `.env` and configure:

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## Deployment

This frontend is designed to be deployed on Render as a Static Site.

### Build Command
```bash
npm run build
```

### Publish Directory
```
dist
```

## Features

- User authentication (signup/login)
- Waste reporting with GPS location
- Interactive map with waste markers
- Cleanup activities feed
- Like and comment system
- User profile and leaderboard
- Real-time updates
