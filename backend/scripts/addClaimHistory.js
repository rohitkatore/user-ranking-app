const mongoose = require("mongoose");
const User = require("../models/user.model");
const ClaimHistory = require("../models/claimHistory.model");
require("dotenv").config();

const addClaimHistory = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    console.log("📋 Fetching all users...");
    const users = await User.find({});

    if (users.length === 0) {
      console.log(
        "❌ No users found in database. Please run seed script first."
      );
      process.exit(1);
    }

    console.log("🎲 Adding realistic claim history...");

    for (const user of users) {
      // Generate 3-8 random claim events for each user
      const numClaims = Math.floor(Math.random() * 6) + 3; // 3-8 claims

      for (let i = 0; i < numClaims; i++) {
        const pointsClaimed = Math.floor(Math.random() * 10) + 1; // 1-10 points

        // Create random timestamp within the last 7 days
        const randomDaysAgo = Math.floor(Math.random() * 7);
        const randomHoursAgo = Math.floor(Math.random() * 24);
        const randomMinutesAgo = Math.floor(Math.random() * 60);

        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - randomDaysAgo);
        timestamp.setHours(timestamp.getHours() - randomHoursAgo);
        timestamp.setMinutes(timestamp.getMinutes() - randomMinutesAgo);

        // Check if this exact claim already exists
        const existingClaim = await ClaimHistory.findOne({
          userId: user._id,
          pointsClaimed,
          timestamp: {
            $gte: new Date(timestamp.getTime() - 60000), // Within 1 minute
            $lte: new Date(timestamp.getTime() + 60000),
          },
        });

        if (!existingClaim) {
          const claimHistory = new ClaimHistory({
            userId: user._id,
            pointsClaimed,
            timestamp,
          });

          await claimHistory.save();
          console.log(
            `✅ Added claim: ${user.name} claimed ${pointsClaimed} points`
          );
        }
      }
    }

    console.log("\n📊 Checking final statistics...");
    const totalClaims = await ClaimHistory.countDocuments();
    const allUsers = await User.find({}).sort({ totalPoints: -1 });

    console.log(`\n🎉 Claim history generation completed!`);
    console.log(`📈 Total claim records: ${totalClaims}`);
    console.log(`👥 Total users: ${allUsers.length}`);
    console.log(
      `🏆 Current leader: ${allUsers[0]?.name} with ${allUsers[0]?.totalPoints} points`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding claim history:", error);
    process.exit(1);
  }
};

// Run the script
addClaimHistory();
