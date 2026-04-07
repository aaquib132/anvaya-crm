const mongoose = require("mongoose");

const initializeDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }
    const host = uri.split("@")[1]?.split("/")[0] || "Unknown Host";
    console.log(`🔄 Attempting to connect to MongoDB Atlas (${host})...`);

    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = initializeDatabase;