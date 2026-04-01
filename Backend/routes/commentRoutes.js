const express = require("express");
const {
  addComment,
  getComments,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/leads/:id/comments", addComment);
router.get("/leads/:id/comments", getComments);

module.exports = router;