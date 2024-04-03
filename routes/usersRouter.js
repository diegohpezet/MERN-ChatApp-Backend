const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const checkSession = require('../middlewares/checkSession');

router.get('/', checkSession, usersController.getAllUsers);
router.get('/user/:id', checkSession, usersController.getSingleUser);

module.exports = router;