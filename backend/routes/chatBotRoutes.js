const express = require('express');
const router = express.Router();
const chatBotController = require('../controllers/chatBotController');

router.post('/request', chatBotController.request);

module.exports = router;