const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');

// GET /api/schemes
router.get('/', schemeController.getSchemes);

module.exports = router;
