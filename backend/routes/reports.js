const express = require('express');
const router = express.Router();

const reportsController = require('../controllers/reportsController');

router.get('/top-medicines', reportsController.topMedicines);
router.get('/doctor-performance', reportsController.doctorPerformance);
router.get('/patient-visits', reportsController.patientVisits);

module.exports = router;