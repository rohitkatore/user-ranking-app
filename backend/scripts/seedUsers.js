const mongoose = require("mongoose");
const User = require("../models/user.model");
require("dotenv").config();

// Indian names for seeding
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

const seedUsers = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Clear existing users (optional - uncomment if you want to start fresh)
    // await User.deleteMany({});
    // console.log('🗑️ Cleared existing users');

    console.log("🌱 Seeding users...");

    const users = [];
    for (const name of indianNames) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
          console.log(`⚠️ User "${name}" already exists, skipping...`);
          continue;
        }

        // Create new user with random initial points
        const initialPoints = Math.floor(Math.random() * 50); // 0-49 points
        const user = new User({
          name,
          totalPoints: initialPoints,
        });

        const savedUser = await user.save();
        users.push(savedUser);
        console.log(`✅ Created user: ${name} with ${initialPoints} points`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️ User "${name}" already exists (duplicate key error)`);
        } else {
          console.error(`❌ Error creating user "${name}":`, error.message);
        }
      }
    }

    console.log(`\n🎉 Successfully seeded ${users.length} users!`);
    console.log("\n📊 Summary:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.totalPoints} points`);
    });

    console.log("\n🚀 Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding script
seedUsers();
