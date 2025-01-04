const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')
const authenticateJWT = require('../utils/authentication');

router.post('/addProduct', authenticateJWT, productController.addProduct);

module.exports = router;