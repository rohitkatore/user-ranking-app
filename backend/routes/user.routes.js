const express = require("express");
const {
  addUser,
  getAllUsers,
  claimPoints,
  getLeaderboard,
  getUserClaimHistory,
} = require("../controllers/user.controller");

const router = express.Router();

// POST /api/users - Add a new user
router.post("/users", addUser);

// GET /api/users - Get all users
router.get("/users", getAllUsers);

// POST /api/users/:userId/claim - Claim points for a user
router.post("/users/:userId/claim", claimPoints);

// GET /api/leaderboard - Get leaderboard (users sorted by points)
router.get("/leaderboard", getLeaderboard);

// GET /api/users/:userId/history - Get user's claim history (bonus feature)
router.get("/users/:userId/history", getUserClaimHistory);

module.exports = router;
