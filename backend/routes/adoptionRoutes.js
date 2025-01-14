const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController')
const authenticateJWT = require('../utils/authentication');

router.get('/getAdoption', adoptionController.getAdoption)

router.post('/giveAdopt', authenticateJWT, adoptionController.giveAdopt)

module.exports = router;