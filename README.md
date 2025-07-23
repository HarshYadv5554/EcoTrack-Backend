# 🌱 EcoTrack - Community Waste Management Platform

> **Track Waste, Clean Earth** - A comprehensive community-driven platform for waste reporting, cleanup verification, and environmental impact tracking.

![EcoTrack Logo](https://img.shields.io/badge/EcoTrack-Community%20Platform-green?style=for-the-badge&logo=leaf)

## 📖 Overview

EcoTrack is a modern web application that empowers communities to report environmental issues, coordinate cleanup efforts, and track their collective impact. Users can report waste locations with GPS coordinates and photos, verify cleanup activities with real-time location data, and share their environmental contributions with the community.

## ✨ Key Features

### 🗺️ **Interactive Waste Mapping**

- **Real-time Google Maps integration** with custom markers
- **GPS-tracked waste reporting** with photo documentation
- **Smart marker system** with color-coded status indicators
- **Location-based filtering** and search capabilities
- **Turn-by-turn directions** to reported waste locations

### 📸 **Cleanup Verification System**

- **GPS-verified cleanup photos** to prevent fraudulent activities
- **Before/after photo comparisons** using original report images
- **Real-time location matching** to ensure accurate cleanup verification
- **Automatic status updates** when cleanup is verified

### 🌐 **Community Feed**

- **Social media-style feed** showcasing cleanup activities
- **Photo galleries** with before, after, and verification images
- **Community engagement** through likes, comments, and sharing
- **Real-time activity tracking** and community statistics

### 🏆 **Gamification & Rewards**

- **Points system** based on waste type and cleanup difficulty
- **Leaderboard rankings** for individual and community performance
- **Achievement badges** for various environmental milestones
- **Rewards marketplace** for redeeming earned eco-points

### 👤 **User Management**

- **Secure authentication** with JWT tokens
- **User profiles** with activity history and achievements
- **Personal dashboards** with cleanup statistics
- **Social features** for community building

### 🎯 **Smart Features**

- **Offline capability** for areas with poor connectivity
- **Dark/light mode** with system preference detection
- **Responsive design** optimized for mobile and desktop
- **Real-time notifications** for nearby cleanup opportunities

## 🛠️ Technology Stack

### **Frontend**

- **React 18** with TypeScript for type-safe development
- **Vite** for fast build tooling and hot module replacement
- **TailwindCSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Lucide React** for consistent iconography
- **Google Maps JavaScript API** with React wrapper

### **Backend**

- **Node.js** with Express.js framework
- **PostgreSQL** database with connection pooling
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **Multer** for file upload handling

### **Database**

- **PostgreSQL** with optimized indexes
- **Neon DB** for cloud-hosted database
- **Automatic triggers** for timestamp updates
- **Referential integrity** with foreign key constraints

### **Development Tools**

- **TypeScript** for enhanced developer experience
- **ESLint & Prettier** for code quality and formatting
- **Vitest** for testing framework
- **Git** for version control

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)
- **Google Maps API key**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ecotrack.git
cd ecotrack
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=8080
NODE_ENV=development

# Google Maps API (get from https://console.cloud.google.com/)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. Database Setup

The application will automatically initialize the database schema on first run. Ensure your PostgreSQL database is accessible with the provided `DATABASE_URL`.

**Required Tables:**

- `users` - User authentication and profiles
- `waste_reports` - Waste location reports
- `cleanup_activities` - Cleanup verification data

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`

## 🌍 Environment Setup Details

### Google Maps API Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Places API**
4. Create credentials (API Key)
5. Configure API key restrictions for security
6. Add the key to your `.env` file as `VITE_GOOGLE_MAPS_API_KEY`

### Database Configuration

#### Option 1: Neon DB (Recommended for Development)

1. Sign up at [Neon](https://neon.tech/)
2. Create a new database
3. Copy the connection string
4. Use it as your `DATABASE_URL`

#### Option 2: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb ecotrack

# Update DATABASE_URL
DATABASE_URL=postgresql://username:password@localhost:5432/ecotrack
```

## 🏗️ Project Structure

```
ecotrack/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Basic UI primitives
│   │   ├── GoogleMap.tsx  # Interactive map component
│   │   ├── Navigation.tsx # Main navigation
│   │   └── ...
│   ├── contexts/          # React context providers
│   ├── pages/             # Page components
│   ├── lib/               # Utility functions and API client
│   └── global.css         # Global styles
├── server/                # Backend Express application
│   ├── routes/            # API route handlers
│   ├── lib/               # Database and utility functions
│   └── index.ts           # Server entry point
├── shared/                # Shared types and utilities
└── public/                # Static assets
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-secure-production-jwt-secret
VITE_GOOGLE_MAPS_API_KEY=your-production-google-maps-key
PORT=8080
```

### Deployment Platforms

The application is configured for deployment on:

- **Vercel** (Frontend)
- **Railway** (Full-stack)
- **Heroku** (Full-stack)
- **DigitalOcean App Platform** (Full-stack)

## 📱 User Workflow

### 1. **Report Waste**

- Take photo of waste location
- Add GPS coordinates automatically
- Describe waste type and severity
- Submit report to community

### 2. **View Map**

- Browse interactive map of reported waste
- Filter by status, type, or proximity
- Get directions to cleanup locations
- Click "Mark as Cleaned" on accessible reports

### 3. **Verify Cleanup**

- Capture GPS-verified photos at cleanup location
- Upload before/after comparison images
- Earn eco-points for verified activities
- Share success with community

### 4. **Track Impact**

- View personal cleanup statistics
- Compare with community leaderboard
- Redeem eco-points for rewards
- Share achievements on social platforms

## 🔧 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Waste Reports Endpoints

- `GET /api/reports` - Get all waste reports
- `POST /api/reports` - Create new waste report
- `GET /api/reports/my` - Get user's reports
- `PUT /api/reports/:id/status` - Update report status

### Cleanup Activities Endpoints

- `GET /api/cleanup-activities` - Get community feed
- `POST /api/cleanup-activities` - Create cleanup verification
- `GET /api/cleanup-activities/my` - Get user's activities
- `POST /api/cleanup-activities/:id/like` - Like activity

### Statistics Endpoints

- `GET /api/feed/stats` - Get community statistics

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Write TypeScript for type safety
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check existing issues** in the GitHub repository
2. **Create a new issue** with detailed description
3. **Join our community** for discussions and support

## 🌟 Acknowledgments

- **Google Maps Platform** for mapping services
- **Neon** for database hosting
- **Radix UI** for accessible components
- **Lucide** for beautiful icons
- **TailwindCSS** for utility-first styling

---

**Made with 💚 for a cleaner planet**

_EcoTrack - Empowering communities to make a environmental difference, one cleanup at a time._
