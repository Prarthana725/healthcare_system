const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const authController = require("../controllers/authController");

// GET USERS
router.get('/', userController.getAll);

router.put("/:id", authController.updateUser);

// CREATE USER
router.post('/', userController.create);

module.exports = router;