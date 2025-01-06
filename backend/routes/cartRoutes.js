const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateJWT = require('../utils/authentication');

router.post("/addToCart", authenticateJWT, cartController.addToCart);
router.get("/getCart", authenticateJWT, cartController.getCart);
router.post("/removeToCart", authenticateJWT, cartController.removeToCart);

module.exports = router;