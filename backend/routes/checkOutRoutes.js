const express = require('express');
const router = express.Router();
const checkOutController = require('../controllers/checkOutController');
const authenticateJWT = require('../utils/authentication');

router.post("/confirm", authenticateJWT, checkOutController.confirm);

module.exports = router;