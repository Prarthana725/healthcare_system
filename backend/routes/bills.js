const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/patient/:patientId', billController.getByPatient);
router.get('/doctor/:doctorId', billController.getByDoctor);
router.get('/report/monthly', billController.getMonthlyReport);
router.get('/:id/calculate', billController.calculateAmount);
router.get('/:id/generate', billController.generateBill);
router.get('/:id', billController.getById);
router.get('/', billController.getAll);

module.exports = router;
