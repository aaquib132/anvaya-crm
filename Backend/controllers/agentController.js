const SalesAgent = require("../models/SalesAgent");

const createAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    // check duplicate email
    const existing = await SalesAgent.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: "Agent with this email already exists",
      });
    }

    const agent = new SalesAgent({ name, email });
    await agent.save();

    res.status(201).json(agent);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAgents = async (req, res) => {
  try {
    const agents = await SalesAgent.find().sort({ createdAt: -1 });

    res.status(200).json(agents);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAgent, getAgents };