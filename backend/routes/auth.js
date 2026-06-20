const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Logic is now entirely inside the controller
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;