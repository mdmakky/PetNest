const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')
const authenticateJWT = require('../utils/authentication');

router.post('/addProduct', authenticateJWT, productController.addProduct);
router.get('/getProduct', authenticateJWT, productController.getProduct);
router.get('/getUserProduct', authenticateJWT, productController.getUserProduct);
router.post('/updateProduct', authenticateJWT, productController.updateProduct);
router.post('/deleteProduct', authenticateJWT, productController.deleteProduct);

module.exports = router;