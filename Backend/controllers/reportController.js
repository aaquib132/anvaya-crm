const Lead = require("../models/Leads");

const getLastWeekClosedLeads = async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const leads = await Lead.find({
      status: "Closed",
      closedAt: { $gte: lastWeek },
    }).populate("salesAgent", "name");

    const formatted = leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      salesAgent: lead.salesAgent?.name,
      closedAt: lead.closedAt,
    }));

    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPipelineCount = async (req, res) => {
  try {
    const count = await Lead.countDocuments({
      status: { $ne: "Closed" },
    });

    res.status(200).json({
      totalLeadsInPipeline: count,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClosedLeadsByAgent = async (req, res) => {
  try {
    const result = await Lead.aggregate([
      {
        $match: { status: "Closed" },
      },
      {
        $group: {
          _id: "$salesAgent",
          totalClosed: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "salesagents",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
      {
        $project: {
          _id: 0,
          agentName: "$agent.name",
          totalClosed: 1,
        },
      },
    ]);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLastWeekClosedLeads,
  getPipelineCount,
  getClosedLeadsByAgent,
};