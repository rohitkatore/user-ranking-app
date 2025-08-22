const mongoose = require("mongoose");
const User = require("../models/user.model");
require("dotenv").config();

const showAllUsers = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    console.log("📋 Fetching all users from database...");
    const users = await User.find({}).sort({ totalPoints: -1 });

    if (users.length === 0) {
      console.log("📭 No users found in the database.");
    } else {
      console.log(`\n🎯 Found ${users.length} users in the database:\n`);
      console.log("Rank | Name              | Points | Created At");
      console.log("-----|-------------------|--------|------------------");

      users.forEach((user, index) => {
        const rank = (index + 1).toString().padStart(4, " ");
        const name = user.name.padEnd(17, " ");
        const points = user.totalPoints.toString().padStart(6, " ");
        const createdAt = user.createdAt.toLocaleDateString();
        console.log(`${rank} | ${name} | ${points} | ${createdAt}`);
      });

      console.log(`\n📊 Total users: ${users.length}`);
      console.log(
        `🏆 Highest score: ${users[0]?.totalPoints || 0} (${
          users[0]?.name || "N/A"
        })`
      );
      console.log(
        `📈 Average score: ${
          Math.round(
            users.reduce((sum, user) => sum + user.totalPoints, 0) /
              users.length
          ) || 0
        }`
      );
    }

    console.log("\n✅ Database query completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    process.exit(1);
  }
};

// Run the script
showAllUsers();
