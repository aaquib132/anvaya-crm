const express = require("express");
const {
  getLastWeekClosedLeads,
  getPipelineCount,
  getClosedLeadsByAgent,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/last-week", getLastWeekClosedLeads);
router.get("/pipeline", getPipelineCount);
router.get("/closed-by-agent", getClosedLeadsByAgent);

module.exports = router;