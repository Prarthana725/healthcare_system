// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET request එකක් ආවම Controller එකේ getSystemOverview function එක වැඩ කරන්න දෙනවා
router.get('/overview', statsController.getSystemOverview.bind(statsController));

module.exports = router;