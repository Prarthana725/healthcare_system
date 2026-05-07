const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// General routes (must come first)
router.get('/', patientController.getAll);
router.post('/', patientController.create);

// ADD THIS NEW ROUTE
router.get('/dashboard/:id', patientController.getPatientDashboard);

// Specific routes (must come after general routes)
router.get('/with-data/:id', patientController.getWithAllData);
router.get('/:id', patientController.getById);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.delete);

module.exports = router;