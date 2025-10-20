# EcoTrack Backend

Backend API for the EcoTrack waste management application.

## Environment Variables

Copy `env.example` to `.env` and configure:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `CORS_ORIGINS`: Allowed frontend origins
- `JWT_SECRET`: Secret key for JWT tokens

## Deployment

This backend is designed to be deployed on Render as a Web Service.

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

## API Endpoints

- `GET /ping` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `GET /reports` - Get waste reports
- `POST /reports` - Create waste report
- `GET /cleanup-activities` - Get cleanup activities
- `POST /cleanup-activities/:id/like` - Like/unlike activity
- `GET /cleanup-activities/:id/comments` - Get comments
- `POST /cleanup-activities/:id/comments` - Add comment
- `DELETE /comments/:id` - Delete comment
