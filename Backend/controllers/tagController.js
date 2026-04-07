const Tag = require("../models/Tag");

const formatTagResponse = (tag) => {
  return {
    id: tag._id,
    name: tag.name,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  };
};

const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Tag name is required",
      });
    }

    const existing = await Tag.findOne({ name });

    if (existing) {
      return res.status(409).json({
        error: "Tag already exists",
      });
    }

    const normalized = name.trim().toLowerCase();

    const tag = new Tag({ name: normalized });
    await tag.save();

    res.status(201).json(formatTagResponse(tag));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });

    res.status(200).json(tags.map(formatTagResponse));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTag, getTags };