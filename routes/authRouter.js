const express = require('express');
const router = express.Router();

// Import controller
const authController = require('../controllers/authController');

// Routes
router.post('/login', authController.login);
router.post('/signup', authController.register);
router.post('/logout', authController.logout);

module.exports = router;