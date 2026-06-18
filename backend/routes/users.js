const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require("../controllers/authController");

// GET USERS
router.get('/', userController.getAll);

// CREATE USER
router.post('/', userController.create);

// UPDATE USER
router.put("/:id", authController.updateUser);

// DELETE USER
router.delete("/:id", userController.deleteUser);

module.exports = router;