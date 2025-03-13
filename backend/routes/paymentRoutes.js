const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController')
const authenticateJWT = require('../utils/authentication');

router.post('/makePayment', authenticateJWT, paymentController.makePayment);

module.exports = router;