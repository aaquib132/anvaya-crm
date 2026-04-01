const Lead = require("../models/Leads");

const createLead = async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    if (!name || !source || !salesAgent || !timeToClose) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const lead = new Lead({
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
    });

    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeads = async (req, res) => {
  try {
    const { salesAgent, status, source, tags } = req.query;

    let filter = {};

    if (salesAgent) {
      filter.salesAgent = salesAgent;
    }

    if (status) {
      filter.status = status;
    }

    if (source) {
      filter.source = source;
    }

    if (tags) {
      filter.tags = { $in: [tags] };
    }

    const leads = await Lead.find(filter)
      .populate("salesAgent", "name email")
      .sort({ createdAt: -1 })
      .lean(); 

    const formatted = leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      source: lead.source,
      salesAgent: lead.salesAgent,
      status: lead.status,
      tags: lead.tags,
      timeToClose: lead.timeToClose,
      priority: lead.priority,
      createdAt: lead.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { createLead, getLeads };
