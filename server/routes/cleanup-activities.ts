import { RequestHandler, Response } from "express";
import { query } from "../lib/database";
import { authenticateToken, AuthenticatedRequest } from "../lib/auth";

// Get all cleanup activities for the feed
export const getAllCleanupActivities: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const filter = (req.query.filter as string) || "all";

    let whereClause = "";
    if (filter === "verified") {
      whereClause = "WHERE verified = true";
    } else if (filter === "recent") {
      whereClause = "WHERE cleaned_at >= NOW() - INTERVAL '24 hours'";
    }

    const result = await query(
      `
      SELECT 
        ca.id, ca.user_id, ca.user_name, ca.waste_report_id, ca.waste_type,
        ca.latitude, ca.longitude, ca.address, ca.description,
        ca.before_image, ca.after_image, ca.verification_image,
        ca.verified, ca.points_earned, ca.likes, ca.comments,
        ca.cleaned_at, ca.created_at,
        u.avatar_url as user_avatar
      FROM cleanup_activities ca
      LEFT JOIN users u ON ca.user_id = u.id
      ${whereClause}
      ORDER BY ca.cleaned_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset],
    );

    const activities = result.rows.map((row) => ({
      id: row.id.toString(),
      userId: row.user_id.toString(),
      userName: row.user_name,
      userAvatar: row.user_avatar,
      wasteReportId: row.waste_report_id?.toString(),
      wasteType: row.waste_type,
      location: {
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        address: row.address,
      },
      description: row.description,
      beforeImage: row.before_image,
      afterImage: row.after_image,
      verificationImage: row.verification_image,
      verified: row.verified,
      pointsEarned: row.points_earned,
      likes: row.likes,
      comments: row.comments,
      cleanedAt: row.cleaned_at,
      createdAt: row.created_at,
    }));

    // Get total count for pagination
    const countResult = await query(`
      SELECT COUNT(*) as total 
      FROM cleanup_activities ca
      ${whereClause}
    `);

    const total = parseInt(countResult.rows[0].total);
    const hasMore = offset + limit < total;

    console.log(
      "getAllCleanupActivities: Returning",
      activities.length,
      "activities",
    );

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Get cleanup activities error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new cleanup activity (verification)
export const createCleanupActivity = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const userName = req.user?.name;

    if (!userId || !userName) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      wasteReportId,
      wasteType,
      latitude,
      longitude,
      address,
      description,
      beforeImage,
      afterImage,
      verificationImage,
    } = req.body;

    // Validate required fields
    if (!wasteType || !latitude || !longitude || !verificationImage) {
      return res.status(400).json({
        error:
          "Missing required fields: wasteType, latitude, longitude, verificationImage",
      });
    }

    // Calculate points based on activity
    const pointsEarned = calculateCleanupPoints(wasteType);

    // If wasteReportId is provided and no beforeImage, get the first image from the waste report
    let finalBeforeImage = beforeImage;
    if (wasteReportId && !beforeImage) {
      const reportResult = await query(
        `SELECT images FROM waste_reports WHERE id = $1`,
        [wasteReportId],
      );
      if (
        reportResult.rows.length > 0 &&
        reportResult.rows[0].images &&
        reportResult.rows[0].images.length > 0
      ) {
        finalBeforeImage = reportResult.rows[0].images[0];
      }
    }

    const result = await query(
      `
      INSERT INTO cleanup_activities (
        user_id, user_name, waste_report_id, waste_type, 
        latitude, longitude, address, description,
        before_image, after_image, verification_image,
        verified, points_earned
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `,
      [
        userId,
        userName,
        wasteReportId,
        wasteType,
        latitude,
        longitude,
        address,
        description,
        finalBeforeImage,
        afterImage,
        verificationImage,
        true,
        pointsEarned, // Auto-verify for now, can add manual verification later
      ],
    );

    // Update user points
    await query(
      `
      UPDATE users 
      SET points = points + $1 
      WHERE id = $2
    `,
      [pointsEarned, userId],
    );

    // If this is related to a waste report, update its status to completed
    if (wasteReportId) {
      await query(
        `
        UPDATE waste_reports 
        SET status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [wasteReportId],
      );
    }

    const activity = {
      id: result.rows[0].id.toString(),
      userId: result.rows[0].user_id.toString(),
      userName: result.rows[0].user_name,
      wasteReportId: result.rows[0].waste_report_id?.toString(),
      wasteType: result.rows[0].waste_type,
      location: {
        latitude: parseFloat(result.rows[0].latitude),
        longitude: parseFloat(result.rows[0].longitude),
        address: result.rows[0].address,
      },
      description: result.rows[0].description,
      beforeImage: result.rows[0].before_image,
      afterImage: result.rows[0].after_image,
      verificationImage: result.rows[0].verification_image,
      verified: result.rows[0].verified,
      pointsEarned: result.rows[0].points_earned,
      likes: result.rows[0].likes,
      comments: result.rows[0].comments,
      cleanedAt: result.rows[0].cleaned_at,
    };

    console.log("Created cleanup activity:", activity.id);

    res.status(201).json({
      activity,
      pointsEarned,
      message: "Cleanup activity verified successfully!",
    });
  } catch (error) {
    console.error("Create cleanup activity error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's cleanup activities
export const getUserCleanupActivities = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const result = await query(
      `
      SELECT 
        ca.id, ca.user_id, ca.user_name, ca.waste_report_id, ca.waste_type,
        ca.latitude, ca.longitude, ca.address, ca.description,
        ca.before_image, ca.after_image, ca.verification_image,
        ca.verified, ca.points_earned, ca.likes, ca.comments,
        ca.cleaned_at, ca.created_at,
        u.avatar_url as user_avatar
      FROM cleanup_activities ca
      LEFT JOIN users u ON ca.user_id = u.id
      WHERE ca.user_id = $1
      ORDER BY ca.cleaned_at DESC
    `,
      [userId],
    );

    const activities = result.rows.map((row) => ({
      id: row.id.toString(),
      userId: row.user_id.toString(),
      userName: row.user_name,
      userAvatar: row.user_avatar,
      wasteReportId: row.waste_report_id?.toString(),
      wasteType: row.waste_type,
      location: {
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        address: row.address,
      },
      description: row.description,
      beforeImage: row.before_image,
      afterImage: row.after_image,
      verificationImage: row.verification_image,
      verified: row.verified,
      pointsEarned: row.points_earned,
      likes: row.likes,
      comments: row.comments,
      cleanedAt: row.cleaned_at,
      createdAt: row.created_at,
    }));

    res.json({ activities });
  } catch (error) {
    console.error("Get user cleanup activities error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Like/unlike a cleanup activity
export const toggleLike = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // For now, just increment the likes count
    // In a real app, you'd want a separate likes table to track who liked what
    const result = await query(
      `
      UPDATE cleanup_activities 
      SET likes = likes + 1
      WHERE id = $1
      RETURNING likes
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cleanup activity not found" });
    }

    res.json({
      likes: result.rows[0].likes,
      message: "Liked successfully",
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get feed statistics
export const getFeedStats: RequestHandler = async (req, res) => {
  try {
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_activities,
        COUNT(CASE WHEN verified = true THEN 1 END) as verified_activities,
        SUM(points_earned) as total_points,
        SUM(likes) as total_likes
      FROM cleanup_activities
    `);

    const photosResult = await query(`
      SELECT COUNT(*) as total_photos
      FROM cleanup_activities
      WHERE verification_image IS NOT NULL
    `);

    const stats = {
      areascleaned: parseInt(statsResult.rows[0].total_activities),
      photosShared: parseInt(photosResult.rows[0].total_photos),
      verificationRate:
        statsResult.rows[0].total_activities > 0
          ? Math.round(
              (statsResult.rows[0].verified_activities /
                statsResult.rows[0].total_activities) *
                100,
            )
          : 0,
      pointsEarned: parseInt(statsResult.rows[0].total_points) || 0,
    };

    res.json({ stats });
  } catch (error) {
    console.error("Get feed stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

<<<<<<< HEAD
// Like/unlike a cleanup activity
export const likeActivity = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { activityId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if user has already liked this activity
    const existingLike = await query(
      `SELECT id FROM user_likes WHERE user_id = $1 AND activity_id = $2`,
      [userId, activityId],
    );

    if (existingLike.rows.length > 0) {
      // Unlike: Remove the like
      await query(
        `DELETE FROM user_likes WHERE user_id = $1 AND activity_id = $2`,
        [userId, activityId],
      );
      
      // Decrement likes count
      const result = await query(
        `UPDATE cleanup_activities 
         SET likes = GREATEST(0, likes - 1)
         WHERE id = $1
         RETURNING likes`,
        [activityId],
      );

      res.json({
        liked: false,
        likes: result.rows[0].likes,
        message: "Activity unliked",
      });
    } else {
      // Like: Add the like
      await query(
        `INSERT INTO user_likes (user_id, activity_id) VALUES ($1, $2)`,
        [userId, activityId],
      );
      
      // Increment likes count
      const result = await query(
        `UPDATE cleanup_activities 
         SET likes = likes + 1
         WHERE id = $1
         RETURNING likes`,
        [activityId],
      );

      res.json({
        liked: true,
        likes: result.rows[0].likes,
        message: "Activity liked",
      });
    }
  } catch (error) {
    console.error("Like activity error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
// Helper function to calculate points based on waste type
function calculateCleanupPoints(wasteType: string): number {
  const pointsMap: { [key: string]: number } = {
    "plastic bottles": 50,
    "cigarette butts": 30,
    "food packaging": 40,
    "paper waste": 25,
    "glass bottles": 45,
    "metal cans": 35,
    "electronic waste": 100,
    "hazardous waste": 150,
    "organic waste": 20,
    "mixed waste": 60,
  };

  const normalizedType = wasteType.toLowerCase();
  return pointsMap[normalizedType] || 30; // Default points
}
