const SalesAgent = require("../models/SalesAgent");

const formatAgentResponse = (agent) => {
  return {
    id: agent._id,
    name: agent.name,
    email: agent.email,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
  };
};

const createAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const existing = await SalesAgent.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: "Agent with this email already exists",
      });
    }

    const agent = new SalesAgent({ name, email });
    await agent.save();

    res.status(201).json(formatAgentResponse(agent));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAgents = async (req, res) => {
  try {
    const agents = await SalesAgent.find().sort({ createdAt: -1 });

    res.status(200).json(agents.map(formatAgentResponse));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const Lead = require("../models/Leads");
    await Lead.updateMany({ salesAgent: id }, { salesAgent: null });

    const deletedAgent = await SalesAgent.findByIdAndDelete(id);

    if (!deletedAgent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.status(200).json({ message: "Agent deleted successfully, leads unassigned", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAgent, getAgents, deleteAgent };