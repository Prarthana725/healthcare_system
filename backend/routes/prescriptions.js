const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

router.post('/', prescriptionController.create);
router.get('/patient/:patientId', prescriptionController.getByPatient);
router.get('/:id', prescriptionController.getById);
router.put('/:id', prescriptionController.update);
router.delete('/:id', prescriptionController.delete);
router.get('/', prescriptionController.getAll);

module.exports = router;

module.exports = router;