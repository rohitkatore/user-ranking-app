const mongoose = require("mongoose");
const User = require("../models/user.model");
const ClaimHistory = require("../models/claimHistory.model");
require("dotenv").config();

const dbManager = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    const command = process.argv[2];

    switch (command) {
      case "clear":
        await clearDatabase();
        break;
      case "reset":
        await resetDatabase();
        break;
      case "stats":
        await showStats();
        break;
      default:
        console.log("📋 Available commands:");
        console.log("  npm run db clear   - Clear all data");
        console.log("  npm run db reset   - Reset and seed fresh data");
        console.log("  npm run db stats   - Show detailed statistics");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  console.log("🗑️ Clearing all data...");
  await User.deleteMany({});
  await ClaimHistory.deleteMany({});
  console.log("✅ Database cleared successfully!");
};

const resetDatabase = async () => {
  console.log("🔄 Resetting database...");
  await clearDatabase();

  const indianNames = [
    "Arjun Sharma",
    "Priya Patel",
    "Rahul Gupta",
    "Sneha Singh",
    "Vikram Kumar",
    "Ananya Reddy",
    "Rohan Verma",
    "Kavya Iyer",
    "Aditya Joshi",
    "Meera Nair",
  ];

  console.log("🌱 Seeding fresh data...");
  for (const name of indianNames) {
    const initialPoints = Math.floor(Math.random() * 50);
    const user = new User({ name, totalPoints: initialPoints });
    await user.save();
    console.log(`✅ Created: ${name} with ${initialPoints} points`);
  }
  console.log("🎉 Database reset completed!");
};

const showStats = async () => {
  const users = await User.find({}).sort({ totalPoints: -1 });
  const claims = await ClaimHistory.find({}).populate("userId", "name");

  console.log("📊 Database Statistics:");
  console.log(`👥 Total Users: ${users.length}`);
  console.log(`📈 Total Claims: ${claims.length}`);
  console.log(
    `🏆 Top Player: ${users[0]?.name} (${users[0]?.totalPoints} points)`
  );
  console.log(
    `📉 Lowest Score: ${users[users.length - 1]?.totalPoints || 0} points`
  );
  console.log(
    `📊 Average Score: ${
      Math.round(
        users.reduce((sum, user) => sum + user.totalPoints, 0) / users.length
      ) || 0
    }`
  );

  const recentClaims = claims.slice(-5);
  console.log("\n🕒 Recent Claims:");
  recentClaims.forEach((claim) => {
    console.log(
      `  ${claim.userId?.name} claimed ${claim.pointsClaimed} points`
    );
  });
};

dbManager();
