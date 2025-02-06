const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController')
const authenticateJWT = require('../utils/authentication');

router.get('/getDoctor', doctorController.getDoctor);
router.post('/request', authenticateJWT, doctorController.addDoctor);

module.exports = router;