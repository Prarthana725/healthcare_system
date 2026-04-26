const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.post('/', appointmentController.create);
router.get('/patient/:patientId', appointmentController.getByPatient);
router.get('/doctor/:doctorId', appointmentController.getByDoctor);
router.get('/:id', appointmentController.getById);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);
router.get('/', appointmentController.getAll);

module.exports = router;

module.exports = router;