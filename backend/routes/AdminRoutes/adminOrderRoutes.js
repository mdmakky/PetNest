const express = require('express');
const router = express.Router();
const adminOrderController = require('../../controllers/AdminControllers/adminOrderController');
const authenticateJWT = require('../../utils/authentication');

router.get('/getOrder', authenticateJWT, adminOrderController.getOrder);
router.put('/updateStatus/:orderId', authenticateJWT, adminOrderController.updateOrderStatus);

module.exports = router;