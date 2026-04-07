const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Lead = require("./models/Leads");

dotenv.config();

const test = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI.split("@")[1]);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected!");
    
    const count = await Lead.countDocuments();
    console.log("Total leads in DB:", count);
    
    const latest = await Lead.find().sort({ createdAt: -1 }).limit(1);
    console.log("Latest lead:", latest[0] ? latest[0].name : "None");
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

test();
