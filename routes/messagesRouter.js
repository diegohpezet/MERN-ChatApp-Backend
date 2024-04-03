const express = require('express');
const router = express.Router();

const messagesController = require('../controllers/messagesController');
const checkSession = require('../middlewares/checkSession');

router.get('/:id', checkSession, messagesController.getMessages);
router.post('/send/:id', checkSession, messagesController.sendMessage);

module.exports = router;