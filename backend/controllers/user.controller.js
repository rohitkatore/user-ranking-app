const mongoose = require("mongoose");
const User = require("../models/user.model");
const ClaimHistory = require("../models/claimHistory.model");

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// POST /api/users - Add User
const addUser = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate that name field exists
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        error: "Name is required and must be a non-empty string",
      });
    }

    const user = new User({ name: name.trim() });
    const savedUser = await user.save();

    res.status(201).json({
      message: "User created successfully!",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        totalPoints: savedUser.totalPoints,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(409).json({
        error: "A user with this name already exists",
      });
    }

    console.error("Error adding user:", error);
    res.status(500).json({
      error: "Failed to create user",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// GET /api/users - Get All Users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, returning only _id and name fields for optimized payload
    const users = await User.find({}).select("name totalPoints createdAt");

    res.status(200).json({
      message: "Users retrieved successfully!",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// POST /api/users/:userId/claim - Claim Points
const claimPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is a valid MongoDB ObjectId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        error: "Invalid user ID format",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Generate random points between 1 and 10
    const pointsAwarded = Math.floor(Math.random() * 10) + 1;

    // Use atomic update to increment user's total points
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: pointsAwarded } },
      { new: true }
    );

    // Create claim history record
    const claimRecord = new ClaimHistory({
      userId,
      pointsClaimed: pointsAwarded,
    });
    await claimRecord.save();

    res.status(200).json({
      message: "Points claimed successfully!",
      pointsAwarded,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        totalPoints: updatedUser.totalPoints,
      },
    });
  } catch (error) {
    console.error("Error claiming points:", error);
    res.status(500).json({
      error: "Failed to claim points",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// GET /api/leaderboard - Get Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    // Fetch all users and sort by totalPoints in descending order
    const leaderboard = await User.find({})
      .select("name totalPoints createdAt")
      .sort({ totalPoints: -1 });

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      _id: user._id,
      name: user.name,
      totalPoints: user.totalPoints,
      createdAt: user.createdAt,
    }));

    res.status(200).json({
      message: "Leaderboard retrieved successfully!",
      totalUsers: rankedLeaderboard.length,
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      error: "Failed to fetch leaderboard",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// GET /api/users/:userId/history - Get User's Claim History (Bonus feature)
const getUserClaimHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is a valid MongoDB ObjectId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        error: "Invalid user ID format",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Fetch claim history for the user
    const claimHistory = await ClaimHistory.find({ userId })
      .sort({ timestamp: -1 })
      .populate("userId", "name");

    res.status(200).json({
      message: "Claim history retrieved successfully!",
      user: {
        _id: user._id,
        name: user.name,
        totalPoints: user.totalPoints,
      },
      totalClaims: claimHistory.length,
      claimHistory,
    });
  } catch (error) {
    console.error("Error fetching claim history:", error);
    res.status(500).json({
      error: "Failed to fetch claim history",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  claimPoints,
  getLeaderboard,
  getUserClaimHistory,
};
