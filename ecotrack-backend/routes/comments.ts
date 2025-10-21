import { RequestHandler, Response } from "express";
import { query } from "../lib/database";
import { authenticateToken, AuthenticatedRequest } from "../lib/auth";

// Get comments for a cleanup activity
export const getActivityComments: RequestHandler = async (req, res) => {
  try {
    const { activityId } = req.params;

    const result = await query(
      `
      SELECT 
        c.id, c.activity_id, c.user_id, c.user_name, c.comment_text,
        c.created_at, c.updated_at,
        u.avatar_url as user_avatar
      FROM activity_comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.activity_id = $1
      ORDER BY c.created_at ASC
    `,
      [activityId],
    );

    const comments = result.rows.map((row) => ({
      id: row.id.toString(),
      activityId: row.activity_id.toString(),
      userId: row.user_id.toString(),
      userName: row.user_name,
      userAvatar: row.user_avatar,
      commentText: row.comment_text,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json({ comments });
  } catch (error) {
    console.error("Get activity comments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a comment to a cleanup activity
export const addActivityComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { activityId } = req.params;
    const { commentText } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name;

    if (!userId || !userName) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!commentText || commentText.trim().length === 0) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    // Verify the activity exists
    const activityResult = await query(
      `SELECT id FROM cleanup_activities WHERE id = $1`,
      [activityId],
    );

    if (activityResult.rows.length === 0) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Insert the comment
    const result = await query(
      `
      INSERT INTO activity_comments (activity_id, user_id, user_name, comment_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [activityId, userId, userName, commentText.trim()],
    );

    // Update the comment count on the activity
    await query(
      `
      UPDATE cleanup_activities 
      SET comments = comments + 1
      WHERE id = $1
    `,
      [activityId],
    );

    const comment = {
      id: result.rows[0].id.toString(),
      activityId: result.rows[0].activity_id.toString(),
      userId: result.rows[0].user_id.toString(),
      userName: result.rows[0].user_name,
      userAvatar: (req.user as any)?.avatar_url || null,
      commentText: result.rows[0].comment_text,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };

    res.status(201).json({
      comment,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Add activity comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment (only by the comment author)
export const deleteActivityComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get the comment and verify ownership
    const commentResult = await query(
      `
      SELECT id, activity_id, user_id FROM activity_comments 
      WHERE id = $1
    `,
      [commentId],
    );

    if (commentResult.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (commentResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    const activityId = commentResult.rows[0].activity_id;

    // Delete the comment
    await query(`DELETE FROM activity_comments WHERE id = $1`, [commentId]);

    // Update the comment count on the activity
    await query(
      `
      UPDATE cleanup_activities 
      SET comments = comments - 1
      WHERE id = $1
    `,
      [activityId],
    );

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete activity comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Apply authentication middleware
export const addCommentHandler: RequestHandler = (req, res, next) =>
  authenticateToken(req as AuthenticatedRequest, res, next);
export const deleteCommentHandler: RequestHandler = (req, res, next) =>
  authenticateToken(req as AuthenticatedRequest, res, next);
