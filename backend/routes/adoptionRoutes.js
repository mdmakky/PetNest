const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController')
const authenticateJWT = require('../utils/authentication');

router.get('/getAdoption', adoptionController.getAdoption)

router.post('/giveAdopt', authenticateJWT, adoptionController.giveAdopt)

router.get('/getUserAdoption', authenticateJWT, adoptionController.getUserAdoption)

router.post('/updateAdoption', authenticateJWT, adoptionController.updateAdoption)

router.post('/deleteAdoption', authenticateJWT, adoptionController.deleteAdoption)

module.exports = router;