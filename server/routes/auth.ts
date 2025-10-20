import { RequestHandler, Response } from "express";
import { query } from "../lib/database";
import {
  hashPassword,
  comparePassword,
  generateToken,
  authenticateToken,
  AuthenticatedRequest,
} from "../lib/auth";

// Register new user
export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const result = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, points, joined_date`,
      [name, email, passwordHash],
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
        joinedDate: user.joined_date,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user
    const result = await query(
      `SELECT id, name, email, password_hash, points, phone, location, avatar_url, joined_date
       FROM users WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar_url,
        points: user.points,
        joinedDate: user.joined_date,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get current user profile
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await query(
      `SELECT id, name, email, phone, location, avatar_url, points, joined_date
       FROM users WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar_url,
        points: user.points,
        joinedDate: user.joined_date,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user profile
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { name, email, phone, location } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    // Check if email is already used by another user
    const existingUser = await query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, userId],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Email is already used by another user",
      });
    }

    // Update user
    const result = await query(
      `UPDATE users SET name = $1, email = $2, phone = $3, location = $4
       WHERE id = $5
       RETURNING id, name, email, phone, location, avatar_url, points, joined_date`,
      [name, email, phone, location, userId],
    );

    const user = result.rows[0];

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar_url,
        points: user.points,
        joinedDate: user.joined_date,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Apply authentication middleware to protected routes
export const getProfileHandler: RequestHandler = (req, res, next) =>
  authenticateToken(req as AuthenticatedRequest, res, next);
export const updateProfileHandler: RequestHandler = (req, res, next) =>
  authenticateToken(req as AuthenticatedRequest, res, next);
