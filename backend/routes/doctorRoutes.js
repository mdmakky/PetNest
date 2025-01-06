const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController')

router.get('/getDoctor', doctorController.getDoctor);

module.exports = router;