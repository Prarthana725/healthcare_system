const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.get('/', medicineController.getAll);
router.get('/low-stock', medicineController.getLowStock);
router.get('/:id', medicineController.getById);
router.post('/', medicineController.create);
router.put('/:id', medicineController.update);
router.delete('/:id', medicineController.delete);

module.exports = router;