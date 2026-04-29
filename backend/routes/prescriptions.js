const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// General routes (must come first)
router.get('/', prescriptionController.getAll);
router.post('/', prescriptionController.create);

// Specific routes (must come after general routes)
router.get('/patient/:patientId', prescriptionController.getByPatient);
router.get('/:id', prescriptionController.getById);
router.get('/:id/bill', prescriptionController.getBillTotal);
router.put('/:id', prescriptionController.update);
router.delete('/:id', prescriptionController.delete);

module.exports = router;