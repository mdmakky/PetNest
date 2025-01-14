const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const authenticateJWT = require('../utils/authentication');

router.get('/profile', authenticateJWT, userController.getProfile);

router.get('/getUserById/:id', authenticateJWT, userController.getUserById);

router.post('/editProfile', authenticateJWT, userController.postEditProfile)

router.post('/removeProfilePic', authenticateJWT, userController.removeProfilePic)

module.exports = router;