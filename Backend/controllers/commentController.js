const Comment = require("../models/Comment");
const Lead = require("../models/Leads");
const mongoose = require("mongoose");
const SalesAgent = require("../models/SalesAgent");

const addComment = async (req, res) => {
  try {
    const { commentText, author } = req.body;
    const leadId = req.params.id;

    if (!commentText || !author) {
      return res.status(400).json({
        error: "Comment and author are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({
        error: "Invalid author ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({
        error: "Invalid lead ID",
      });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    const agent = await SalesAgent.findById(author);
    if (!agent) {
      return res.status(404).json({
        error: "Agent not found",
      });
    }

    const comment = new Comment({
      lead: leadId,
      author,
      commentText,
    });

    await comment.save();
    const populatedComment = await comment.populate("author", "name email");
    res.status(201).json(comment); 

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const leadId = req.params.id;

    const comments = await Comment.find({ lead: leadId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments); 

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addComment, getComments };