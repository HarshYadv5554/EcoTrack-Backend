# 🌱 EcoTrack - Environmental Waste Management Platform

A full-stack web application for tracking and managing environmental waste, built with React, Express, and PostgreSQL. Users can report waste, track cleanup activities, and earn rewards for environmental contributions.

## 🚀 Live Demo

- **Frontend**: [https://ecotrack-frontend-tzew.onrender.com](https://ecotrack-frontend-tzew.onrender.com)
- **Backend API**: [https://ecotrack-backend-1.onrender.com](https://ecotrack-backend-1.onrender.com)

## ✨ Features

### 🗺️ **Interactive Map**
- Real-time waste reporting with GPS coordinates
- Google Maps integration for location selection
- Visual markers for different waste types and severity levels
- Get directions to reported waste locations

### 📱 **Waste Reporting**
- Photo upload for before/after cleanup verification
- Categorize waste by type (plastic, organic, electronic, etc.)
- Set severity levels (low, medium, high, critical)
- Contact information for authorities

### 🌟 **Community Feed**
- View cleanup activities from other users
- Like and comment on cleanup posts
- Before/after image comparisons
- Points and rewards system

### 👥 **User Management**
- Secure authentication with JWT tokens
- User profiles with cleanup statistics
- Leaderboard for top contributors
- Reward system for environmental actions

### 📊 **Analytics & Insights**
- Personal cleanup statistics
- Community impact metrics
- Cleanup verification rates
- Points earned tracking

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **Google Maps API** for location services

### **Backend**
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **JWT** for authentication
- **CORS** enabled for cross-origin requests
- **bcryptjs** for password hashing

### **Deployment**
- **Render** for hosting
- **Supabase** for PostgreSQL database**
- **GitHub** for version control

## 📁 Project Structure

```
EcoTrack-Backend-main/
├── client/                     # React frontend (development)
├── server/                     # Express backend (development)
├── shared/                     # Shared types and interfaces
├── ecotrack-frontend/          # Production frontend
├── ecotrack-backend/           # Production backend
├── dist/                       # Built files
└── docs/                       # Documentation
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- Google Maps API key

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshYadv5554/EcoTrack-Backend.git
   cd EcoTrack-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   DATABASE_URL=postgresql://username:password@localhost:5432/ecotrack
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGINS=http://localhost:5173,http://localhost:5174
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start individually
   npm run dev          # Frontend only
   npm run dev:server   # Backend only
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🌐 Production Deployment

### **Frontend Deployment (Render)**
1. Connect your GitHub repository to Render
2. Create a new Static Site
3. Set build command: `npm install && npm run build`
4. Set publish directory: `dist`
5. Add environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

### **Backend Deployment (Render)**
1. Create a new Web Service
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables:
   ```
   DATABASE_URL=your-supabase-postgresql-url
   JWT_SECRET=your-secure-jwt-secret
   NODE_ENV=production
   CORS_ORIGINS=https://your-frontend-url.onrender.com
   FRONTEND_URL_PROD=https://your-frontend-url.onrender.com
   BACKEND_URL_PROD=https://your-backend-url.onrender.com
   ```

## 🗄️ Database Schema

### **Users Table**
- `id`, `email`, `name`, `password_hash`
- `phone`, `location`, `avatar_url`
- `points`, `created_at`, `updated_at`

### **Waste Reports Table**
- `id`, `user_id`, `location` (lat/lng), `address`
- `waste_type`, `severity`, `description`
- `images`, `contact_name`, `contact_phone`
- `status`, `reported_at`

### **Cleanup Activities Table**
- `id`, `user_id`, `waste_report_id`
- `waste_type`, `location`, `description`
- `before_image`, `after_image`, `verification_image`
- `points_earned`, `cleaned_at`

### **Comments & Likes**
- `activity_comments` for user comments
- `user_likes` for activity likes

## 🔧 API Endpoints

### **Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### **Waste Reports**
- `GET /reports` - Get all reports
- `GET /reports/my` - Get user's reports
- `POST /reports` - Create new report
- `PUT /reports/:id/status` - Update report status

### **Cleanup Activities**
- `GET /cleanup-activities` - Get feed activities
- `POST /cleanup-activities` - Create cleanup activity
- `GET /cleanup-activities/my` - Get user's activities
- `POST /cleanup-activities/:id/like` - Like activity
- `GET /feed/stats` - Get feed statistics

### **Comments**
- `GET /cleanup-activities/:id/comments` - Get comments
- `POST /cleanup-activities/:id/comments` - Add comment
- `DELETE /comments/:id` - Delete comment

## 🔐 Environment Variables

### **Backend (.env)**
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=3000
CORS_ORIGINS=https://your-frontend-url.onrender.com
FRONTEND_URL_PROD=https://your-frontend-url.onrender.com
BACKEND_URL_PROD=https://your-backend-url.onrender.com
```

### **Frontend (.env)**
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_APP_NAME=EcoTrack
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Mobile browsers
- Tablet devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Maps API** for location services
- **Radix UI** for accessible components
- **Tailwind CSS** for styling
- **Render** for hosting services
- **Supabase** for database services

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/HarshYadv5554/EcoTrack-Backend/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - User authentication
  - Waste reporting
  - Interactive map
  - Community feed
  - Cleanup verification
  - Points and rewards system

---

**🌱 Together, let's make our planet cleaner, one cleanup at a time! 🌱**