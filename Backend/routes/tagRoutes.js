const express = require("express");
const {
  createTag,
  getTags,
} = require("../controllers/tagController");

const router = express.Router();

router.post("/", createTag);
router.get("/", getTags);

module.exports = router;