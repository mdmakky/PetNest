const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/detailsController');
const authenticateJWT = require('../utils/authentication');

router.get('/getProductById/:id', detailsController.getProductById);
router.post('/addReview', authenticateJWT, detailsController.addReview);

module.exports = router;