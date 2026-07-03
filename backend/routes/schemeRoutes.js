const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');

// GET /api/schemes
router.get('/', schemeController.getSchemes);

// POST /api/schemes/eligibility
router.post('/eligibility', schemeController.checkEligibility);

// POST /api/schemes/chat
router.post('/chat', schemeController.chatAssistant);

module.exports = router;
