const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController')
const authenticateJWT = require('../utils/authentication');

router.get('/getOrder', authenticateJWT, orderController.getOrder);
router.post('/cancelOrder/:orderId', authenticateJWT, orderController.cancelOrder);

module.exports = router;