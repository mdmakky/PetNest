const express = require('express');
const router = express.Router();
const adminPaymentDetailsController = require('../../controllers/AdminControllers/adminPaymentDetailsController');
const authenticateJWT = require('../../utils/authentication');

router.get('/getPayment', authenticateJWT, adminPaymentDetailsController.getPayment);

module.exports = router;