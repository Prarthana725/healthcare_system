const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// General routes (must come first)
router.get('/', medicineController.getAll);
router.post('/', medicineController.create);

// Specific routes (must come after general routes)
router.get('/low-stock', medicineController.getLowStock);
router.get('/with-usage', medicineController.getWithUsage);
router.post(
    '/issue',
    medicineController.issue
);

router.get(
    '/issue-history',
    medicineController.issueHistory
);

router.post(
    '/reduce-stock',
    medicineController.reduceStock
);
router.get('/:id', medicineController.getById);
router.put('/:id', medicineController.update);
router.delete('/:id', medicineController.delete);

module.exports = router;