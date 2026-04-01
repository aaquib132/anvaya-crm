const mongoose = require("mongoose");

const initializeDatabase = async () => {
  try {
    console.log("🔄 Connecting to MongoDB..."); // 👈 ADD THIS

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = initializeDatabase;