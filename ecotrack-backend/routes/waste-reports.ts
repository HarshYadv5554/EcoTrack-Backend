import { RequestHandler, Response } from "express";
import { query } from "../lib/database";
import { authenticateToken, AuthenticatedRequest } from "../lib/auth";

// Get all waste reports
export const getAllReports: RequestHandler = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, user_id, user_name, latitude, longitude, address,
        waste_type, severity, description, images, status,
        contact_name, contact_phone, reported_at, updated_at
      FROM waste_reports
      ORDER BY reported_at DESC
    `);

    const reports = result.rows.map((row) => ({
      id: row.id.toString(),
      userId: row.user_id.toString(),
      userName: row.user_name,
      location: {
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        address: row.address,
      },
      wasteType: row.waste_type,
      severity: row.severity,
      description: row.description,
      images: row.images || [],
      status: row.status,
      contactName: row.contact_name,
      contactPhone: row.contact_phone,
      reportedAt: row.reported_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at,
    }));

    console.log("getAllReports: Found", result.rows.length, "raw rows");
    console.log(
      "getAllReports: Returning",
      reports.length,
      "processed reports",
    );
    reports.forEach((report, index) => {
      console.log(`Report ${index + 1}:`, {
        id: report.id,
        wasteType: report.wasteType,
        lat: report.location.latitude,
        lng: report.location.longitude,
        status: report.status,
        severity: report.severity,
      });
    });

    res.json({ reports });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get reports by user
export const getUserReports = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    const result = await query(
      `
      SELECT 
        id, user_id, user_name, latitude, longitude, address,
        waste_type, severity, description, images, status,
        contact_name, contact_phone, reported_at, updated_at
      FROM waste_reports
      WHERE user_id = $1
      ORDER BY reported_at DESC
    `,
      [userId],
    );

    const reports = result.rows.map((row) => ({
      id: row.id.toString(),
      userId: row.user_id.toString(),
      userName: row.user_name,
      location: {
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        address: row.address,
      },
      wasteType: row.waste_type,
      severity: row.severity,
      description: row.description,
      images: row.images || [],
      status: row.status,
      contactName: row.contact_name,
      contactPhone: row.contact_phone,
      reportedAt: row.reported_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at,
    }));

    res.json({ reports });
  } catch (error) {
    console.error("Get user reports error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new waste report
export const createReport = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const userName = req.user?.name;

    const {
      location,
      wasteType,
      severity,
      description,
      images,
      contactName,
      contactPhone,
    } = req.body;

    // Validation
    if (
      !location?.latitude ||
      !location?.longitude ||
      !wasteType ||
      !severity ||
      !description ||
      !contactName
    ) {
      return res.status(400).json({
        error:
          "Location, waste type, severity, description, and contact name are required",
      });
    }

    if (!["low", "medium", "high", "critical"].includes(severity)) {
      return res.status(400).json({
        error: "Invalid severity level",
      });
    }

    const result = await query(
      `
      INSERT INTO waste_reports (
        user_id, user_name, latitude, longitude, address, waste_type,
        severity, description, images, contact_name, contact_phone
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
      [
        userId,
        userName,
        location.latitude,
        location.longitude,
        location.address || "",
        wasteType,
        severity,
        description,
        images || [],
        contactName,
        contactPhone || null,
      ],
    );

    const report = result.rows[0];

    // Award points to user
    await query("UPDATE users SET points = points + 50 WHERE id = $1", [
      userId,
    ]);

  // Also create a corresponding cleanup activity for the feed (if images exist)
  try {
    const beforeImg = (report.images && report.images.length > 0)
      ? report.images[0]
      : null;
    const afterImg = (report.images && report.images.length > 1)
      ? report.images[1]
      : null;

    if (beforeImg || afterImg) {
      await query(
        `
        INSERT INTO cleanup_activities (
          user_id, user_name, waste_report_id, waste_type,
          latitude, longitude, address, description,
          before_image, after_image, verification_image,
          verified, points_earned
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `,
        [
          userId,
          userName,
          report.id,
          report.waste_type,
          report.latitude,
          report.longitude,
          report.address,
          report.description,
          beforeImg,
          afterImg,
          (afterImg || beforeImg), // ensure non-null verification image
          false,    // not verified by default
          0,
        ],
      );
    }
  } catch (e) {
    console.warn("Failed to create cleanup activity from report:", e);
  }

    res.status(201).json({
      message: "Waste report created successfully",
      pointsEarned: 50,
      report: {
        id: report.id.toString(),
        userId: report.user_id.toString(),
        userName: report.user_name,
        location: {
          latitude: parseFloat(report.latitude),
          longitude: parseFloat(report.longitude),
          address: report.address,
        },
        wasteType: report.waste_type,
        severity: report.severity,
        description: report.description,
        images: report.images || [],
        status: report.status,
        contactName: report.contact_name,
        contactPhone: report.contact_phone,
        reportedAt: report.reported_at,
        updatedAt: report.updated_at,
      },
    });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update report status (for authorities)
export const updateReportStatus = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    let updateQuery = `UPDATE waste_reports SET status = $1`;
    let updateParams = [status, id];
    if (status === "completed") {
      updateQuery = `UPDATE waste_reports SET status = $1, completed_at = NOW() WHERE id = $2 RETURNING *`;
    } else {
      updateQuery = `UPDATE waste_reports SET status = $1 WHERE id = $2 RETURNING *`;
    }
    const result = await query(updateQuery, updateParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Report not found",
      });
    }

    const report = result.rows[0];

    res.json({
      message: "Report status updated successfully",
      report: {
        id: report.id.toString(),
        userId: report.user_id.toString(),
        userName: report.user_name,
        location: {
          latitude: parseFloat(report.latitude),
          longitude: parseFloat(report.longitude),
          address: report.address,
        },
        wasteType: report.waste_type,
        severity: report.severity,
        description: report.description,
        images: report.images || [],
        status: report.status,
        contactName: report.contact_name,
        contactPhone: report.contact_phone,
        reportedAt: report.reported_at,
        updatedAt: report.updated_at,
        completedAt: report.completed_at,
      },
    });
  } catch (error) {
    console.error("Update report status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Apply authentication middleware
export const createReportHandler: RequestHandler = (req, res, next) =>
  authenticateToken(req as AuthenticatedRequest, res, next);
export const getUserReportsHandler: RequestHandler = (req, res, next) =>
  authenticateToken(req as AuthenticatedRequest, res, next);
export const updateReportStatusHandler: RequestHandler = (req, res, next) =>
  authenticateToken(req as AuthenticatedRequest, res, next);
