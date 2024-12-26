const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/profile', userController.getProfile)

router.get('/editProfile', userController.getEditProfile)

router.post('/editProfile', userController.postEditProfile)

router.post('/removeProfilePic', userController.removeProfilePic)

module.exports = router;