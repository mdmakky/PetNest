const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const authenticateJWT = require('../utils/authentication');

router.get('/profile', authenticateJWT, userController.getProfile);

router.get('/editProfile', authenticateJWT, userController.getEditProfile)

router.post('/editProfile', authenticateJWT, userController.postEditProfile)

router.post('/removeProfilePic', userController.removeProfilePic)

module.exports = router;