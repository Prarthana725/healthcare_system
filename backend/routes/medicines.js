const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.post('/', medicineController.create);
router.get('/low-stock', medicineController.getLowStock);
router.get('/with-usage', medicineController.getWithUsage);
router.get('/:id', medicineController.getById);
router.put('/:id', medicineController.update);
router.delete('/:id', medicineController.delete);
router.get('/', medicineController.getAll);

module.exports = router;