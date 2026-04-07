const express = require("express");
const {
  createAgent,
  getAgents,
  deleteAgent,
} = require("../controllers/agentController");

const router = express.Router();

router.post("/", createAgent);
router.get("/", getAgents);
router.delete("/:id", deleteAgent);

module.exports = router;