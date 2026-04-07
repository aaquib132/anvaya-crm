const Lead = require("../models/Leads");

const createLead = async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    if (!name || !source || (timeToClose === undefined || timeToClose === null)) {
      return res.status(400).json({ error: "Missing required fields: name, source, and timeToClose are mandatory." });
    }

    const lead = new Lead({
      name,
      source,
      salesAgent: salesAgent || null,
      status,
      tags,
      timeToClose,
      priority,
    });

    res.status(201).json(lead);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
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

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.salesAgent === "") {
        updates.salesAgent = null;
    }
    
    const lead = await Lead.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    
    // We want to return the populated lead, same as getLeads
    const populatedLead = await Lead.findById(id).populate("salesAgent", "name email").lean();
    populatedLead.id = populatedLead._id;
    
    res.status(200).json(populatedLead);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createLead, getLeads, updateLead, deleteLead };
