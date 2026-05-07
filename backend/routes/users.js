const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// GET USERS
router.get('/', userController.getAll);

// CREATE USER
router.post('/', userController.create);

module.exports = router;