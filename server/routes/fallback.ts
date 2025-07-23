import { RequestHandler } from "express";

// Fallback auth routes when database is not available
export const fallbackLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Mock successful login for demo purposes
  const mockUser = {
    id: "1",
    name: "Demo User",
    email: email,
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: null,
    points: 1250,
    joinedDate: "2024-01-01T00:00:00.000Z",
  };

  // Mock token
  const mockToken = "demo-token-" + Date.now();

  res.json({
    message: "Login successful (demo mode)",
    token: mockToken,
    user: mockUser,
  });
};

export const fallbackRegister: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Name, email, and password are required",
    });
  }

  // Mock successful registration
  const mockUser = {
    id: "1",
    name: name,
    email: email,
    phone: null,
    location: null,
    avatar: null,
    points: 0,
    joinedDate: new Date().toISOString(),
  };

  // Mock token
  const mockToken = "demo-token-" + Date.now();

  res.status(201).json({
    message: "User registered successfully (demo mode)",
    token: mockToken,
    user: mockUser,
  });
};

export const fallbackGetProfile: RequestHandler = async (req, res) => {
  // Mock user profile
  const mockUser = {
    id: "1",
    name: "Demo User",
    email: "demo@ecotrack.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: null,
    points: 1250,
    joinedDate: "2024-01-01T00:00:00.000Z",
  };

  res.json({ user: mockUser });
};

export const fallbackUpdateProfile: RequestHandler = async (req, res) => {
  const { name, email, phone, location } = req.body;

  // Mock updated user
  const mockUser = {
    id: "1",
    name: name || "Demo User",
    email: email || "demo@ecotrack.com",
    phone: phone || "+1 (555) 123-4567",
    location: location || "New York, NY",
    avatar: null,
    points: 1250,
    joinedDate: "2024-01-01T00:00:00.000Z",
  };

  res.json({
    message: "Profile updated successfully (demo mode)",
    user: mockUser,
  });
};

// Fallback waste reports routes
export const fallbackGetAllReports: RequestHandler = async (req, res) => {
  try {
    console.log("Fallback getAllReports called");
    // Mock reports data
    const mockReports = [
      {
        id: "1",
        userId: "1",
        userName: "Demo User",
        location: {
          latitude: 40.7829,
          longitude: -73.9654,
          address: "Central Park, Downtown",
        },
        wasteType: "Plastic Bottles",
        severity: "medium",
        description:
          "Several plastic bottles scattered near the playground area.",
        images: [],
        status: "pending",
        contactName: "Demo User",
        contactPhone: "+1 (555) 123-4567",
        reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        userId: "2",
        userName: "Sarah Chen",
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          address: "Main Street & 5th Ave",
        },
        wasteType: "Food Waste",
        severity: "high",
        description: "Large pile of food waste attracting pests.",
        images: [],
        status: "in_progress",
        contactName: "Sarah Chen",
        contactPhone: "+1 (555) 987-6543",
        reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ];

    res.json({ reports: mockReports });
  } catch (error) {
    console.error("Error in fallbackGetAllReports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fallbackCreateReport: RequestHandler = async (req, res) => {
  const reportData = req.body;

  // Mock successful report creation
  const mockReport = {
    id: Date.now().toString(),
    userId: "1",
    userName: "Demo User",
    location: reportData.location,
    wasteType: reportData.wasteType,
    severity: reportData.severity,
    description: reportData.description,
    images: reportData.images || [],
    status: "pending",
    contactName: reportData.contactName,
    contactPhone: reportData.contactPhone,
    reportedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  res.status(201).json({
    message: "Waste report created successfully (demo mode)",
    pointsEarned: 50,
    report: mockReport,
  });
};
