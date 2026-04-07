const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')
const mongoose = require("mongoose");

const leadRoutes = require("./routes/leadRoutes");
const agentRoutes = require("./routes/agentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const tagRoutes = require("./routes/tagRoutes");
const reportRoutes = require("./routes/reportRoutes");

const initializeDatabase = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Anvaya CRM API running 🚀");
});

// Routes
app.use('/leads', leadRoutes);
app.use("/agents", agentRoutes);
app.use("/", commentRoutes);
app.use("/tags", tagRoutes);
app.use("/report", reportRoutes);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initializeDatabase(); 

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
};

startServer();
