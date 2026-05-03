const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

router.get('/patient-summary', viewController.getPatientSummary);
router.get('/medicine-usage', viewController.getMedicineUsage);

module.exports = router;