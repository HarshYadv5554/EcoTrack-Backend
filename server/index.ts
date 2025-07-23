import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./lib/init-db";
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
  toggleLike,
  getFeedStats,
} from "./routes/cleanup-activities";

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

dotenv.config();

export async function createServer() {
  const app = express();

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

  // Health check
  app.get("/ping", (req, res) => {
    res.json({
      message: "EcoTrack API is running!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
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
    app.post("/cleanup-activities/:id/like", authenticateToken, toggleLike);
    app.get("/feed/stats", getFeedStats);
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
  }

  return app;
}
