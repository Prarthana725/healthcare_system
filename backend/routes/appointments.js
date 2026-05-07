const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// General routes (must come first)
router.get('/', appointmentController.getAll);
router.post('/', appointmentController.create);

// Specific routes (must come after general routes)
router.get('/patient/:patientId', appointmentController.getByPatient);
router.get('/doctor/:doctorId', appointmentController.getByDoctor);
router.put('/:id/status', appointmentController.updateStatus);
router.get('/:id', appointmentController.getById);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);

module.exports = router;