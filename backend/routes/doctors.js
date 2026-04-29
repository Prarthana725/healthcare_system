const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// General routes (must come first)
router.get('/', doctorController.getAll);
router.post('/', doctorController.create);

// Specific routes (must come after general routes)
router.get('/with-appointments', doctorController.getAllWithAppointments);
router.get('/with-data/:id', doctorController.getWithAllData);
router.get('/:id/appointments', doctorController.getWithAppointments);
router.get('/:id', doctorController.getById);
router.put('/:id', doctorController.update);
router.delete('/:id', doctorController.delete);

module.exports = router;