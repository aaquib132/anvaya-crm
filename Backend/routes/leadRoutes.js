const express = require('express')
const { createLead, getLeads, updateLead } = require('../controllers/leadController')

const router = express.Router()

router.get("/", getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);

module.exports = router;



