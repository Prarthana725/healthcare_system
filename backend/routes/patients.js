const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/', patientController.create);
router.get('/:id', patientController.getById);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.delete);
router.get('/', patientController.getAll);

module.exports = router;

module.exports = router;