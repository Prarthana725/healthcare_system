const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.post('/', doctorController.create);
router.get('/with-appointments', doctorController.getAllWithAppointments);
router.get('/:id/appointments', doctorController.getWithAppointments);
router.get('/:id', doctorController.getById);
router.put('/:id', doctorController.update);
router.delete('/:id', doctorController.delete);
router.get('/', doctorController.getAll);

module.exports = router;

module.exports = router;