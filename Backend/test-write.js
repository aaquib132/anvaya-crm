const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Lead = require("./models/Leads");

dotenv.config();

const testPersistence = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI.split("@")[1]);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected!");
    
    const countBefore = await Lead.countDocuments();
    console.log("Count before:", countBefore);
    
    const testName = "Test Persistence " + Date.now();
    const newLead = new Lead({
      name: testName,
      source: "Website",
      status: "New",
      timeToClose: 10,
      priority: "Medium"
    });
    
    await newLead.save();
    console.log("Saved lead:", testName);
    
    const countAfter = await Lead.countDocuments();
    console.log("Count after:", countAfter);
    
    const found = await Lead.findOne({ name: testName });
    console.log("Found in DB:", found ? "Yes" : "No");
    
    // Clean up
    await Lead.deleteOne({ _id: found._id });
    console.log("Deleted test lead.");
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

testPersistence();
