import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./lib/init-db";
<<<<<<< HEAD
import { pool } from "./lib/database";
=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
import { handleDemo } from "./routes/demo";

// Auth routes
import {
  register,
  login,
  getProfile,
  updateProfile,
  getProfileHandler,
  updateProfileHandler,
} from "./routes/auth";

// Waste reports routes
import {
  getAllReports,
  getUserReports,
  createReport,
  updateReportStatus,
  createReportHandler,
  getUserReportsHandler,
  updateReportStatusHandler,
} from "./routes/waste-reports";

// Cleanup activities routes
import {
  getAllCleanupActivities,
  createCleanupActivity,
  getUserCleanupActivities,
<<<<<<< HEAD
  likeActivity,
  getFeedStats,
} from "./routes/cleanup-activities";

// Comments routes
import {
  getActivityComments,
  addActivityComment,
  deleteActivityComment,
  addCommentHandler,
  deleteCommentHandler,
} from "./routes/comments";

=======
  toggleLike,
  getFeedStats,
} from "./routes/cleanup-activities";

>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
import { authenticateToken } from "./lib/auth";

// Fallback routes
import {
  fallbackLogin,
  fallbackRegister,
  fallbackGetProfile,
  fallbackUpdateProfile,
  fallbackGetAllReports,
  fallbackCreateReport,
} from "./routes/fallback";

<<<<<<< HEAD
import config from "./config";

=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
dotenv.config();

export async function createServer() {
  const app = express();
<<<<<<< HEAD
  
  // Debug CORS configuration
  console.log('CORS_ORIGINS from env:', process.env.CORS_ORIGINS);
  console.log('CORS_ORIGINS from config:', config.CORS_ORIGINS);
  console.log('Allowed origins:', config.getAllowedOrigins());

  // CORS configuration
  const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = config.getAllowedOrigins();
      console.log(`CORS check - Origin: ${origin}`);
      console.log(`CORS check - Allowed origins: ${allowedOrigins.join(', ')}`);
      
      if (allowedOrigins.includes(origin)) {
        console.log(`CORS allowed for origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`CORS blocked request from origin: ${origin}`);
        console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Check database availability based on configured pool
  let isDatabaseAvailable = !!pool;

  if (isDatabaseAvailable) {
    try {
      await initializeDatabase();
      console.log("Database is available. Using real routes.");
    } catch (err) {
      console.error("Database initialization failed. Falling back to demo mode.", err);
      isDatabaseAvailable = false;
    }
  } else {
    console.log("Database not configured. Running in demo mode.");
  }

  // Background task: prune cleanup activities older than 24 hours
  if (isDatabaseAvailable) {
    const PRUNE_INTERVAL_MS = 10 * 60 * 1000; // every 10 minutes
    setInterval(async () => {
      try {
        const { query } = await import('./lib/database');
        await query(
          `DELETE FROM cleanup_activities WHERE cleaned_at < NOW() - INTERVAL '24 hours'`
        );
      } catch (e) {
        console.error('Prune old cleanup activities failed:', e);
      }
    }, PRUNE_INTERVAL_MS);
  }

  // CORS preflight handler
  app.options('*', cors(corsOptions));

=======

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Check database availability
  let isDatabaseAvailable = false;

  // Check if DATABASE_URL is properly configured
  if (
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL !==
      "postgresql://username:password@hostname:port/database"
  ) {
    try {
      await initializeDatabase();
      isDatabaseAvailable = true;
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      console.log("Running in demo mode without database");
      isDatabaseAvailable = false;
    }
  } else {
    console.log("DATABASE_URL not configured. Running in demo mode.");
    isDatabaseAvailable = false;
  }

>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
  // Health check
  app.get("/ping", (req, res) => {
    res.json({
      message: "EcoTrack API is running!",
      timestamp: new Date().toISOString(),
<<<<<<< HEAD
      environment: config.NODE_ENV,
      frontendUrl: config.getCurrentFrontendUrl(),
      backendUrl: config.getCurrentBackendUrl(),
      corsOrigins: config.CORS_ORIGINS,
=======
      environment: process.env.NODE_ENV || "development",
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
    });
  });

  // Legacy demo route
  app.get("/demo", handleDemo);

  // Authentication routes - use fallback if database not available
  if (isDatabaseAvailable) {
    app.post("/auth/register", register);
    app.post("/auth/login", login);
    app.get("/auth/profile", getProfileHandler, getProfile);
    app.put("/auth/profile", updateProfileHandler, updateProfile);
  } else {
    app.post("/auth/register", fallbackRegister);
    app.post("/auth/login", fallbackLogin);
    app.get("/auth/profile", fallbackGetProfile);
    app.put("/auth/profile", fallbackUpdateProfile);
  }

  // Waste reports routes - use fallback if database not available
  if (isDatabaseAvailable) {
    app.get("/reports", getAllReports);
    app.get("/reports/my", getUserReportsHandler, getUserReports);
    app.post("/reports", createReportHandler, createReport);
    app.put(
      "/reports/:id/status",
      updateReportStatusHandler,
      updateReportStatus,
    );
  } else {
    app.get("/reports", fallbackGetAllReports);
    app.get("/reports/my", fallbackGetAllReports); // Same for demo
    app.post("/reports", fallbackCreateReport);
    app.put("/reports/:id/status", (req, res) =>
      res.json({ message: "Status updated (demo mode)" }),
    );
  }

  // Cleanup activities routes - database required
  if (isDatabaseAvailable) {
    app.get("/cleanup-activities", getAllCleanupActivities);
    app.get(
      "/cleanup-activities/my",
      authenticateToken,
      getUserCleanupActivities,
    );
    app.post("/cleanup-activities", authenticateToken, createCleanupActivity);
<<<<<<< HEAD
    app.post("/cleanup-activities/:id/like", authenticateToken, likeActivity);
    app.get("/feed/stats", getFeedStats);

    // Comments routes
    app.get("/cleanup-activities/:activityId/comments", getActivityComments);
    app.post("/cleanup-activities/:activityId/comments", addCommentHandler, addActivityComment);
    app.delete("/comments/:commentId", deleteCommentHandler, deleteActivityComment);
=======
    app.post("/cleanup-activities/:id/like", authenticateToken, toggleLike);
    app.get("/feed/stats", getFeedStats);
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
  } else {
    // Fallback for demo mode
    app.get("/cleanup-activities", (req, res) =>
      res.json({
        activities: [],
        pagination: { page: 1, limit: 10, total: 0, hasMore: false },
      }),
    );
    app.get("/cleanup-activities/my", (req, res) =>
      res.json({ activities: [] }),
    );
    app.post("/cleanup-activities", (req, res) =>
      res.json({
        message: "Cleanup activity created (demo mode)",
        pointsEarned: 50,
      }),
    );
    app.post("/cleanup-activities/:id/like", (req, res) =>
      res.json({ likes: 1, message: "Liked (demo mode)" }),
    );
    app.get("/feed/stats", (req, res) =>
      res.json({
        stats: {
          areascleaned: 156,
          photosShared: 2300,
          verificationRate: 89,
          pointsEarned: 45000,
        },
      }),
    );
<<<<<<< HEAD

    // Demo mode comments routes
    app.get("/cleanup-activities/:activityId/comments", (req, res) =>
      res.json({ comments: [] }),
    );
    app.post("/cleanup-activities/:activityId/comments", (req, res) =>
      res.json({ message: "Comment added (demo mode)" }),
    );
    app.delete("/comments/:commentId", (req, res) =>
      res.json({ message: "Comment deleted (demo mode)" }),
    );
=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
  }

  return app;
}
