const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

router.get('/verifyEmail', authController.getVerifyEmail);

router.post('/verifyEmail', authController.postVerifyEmail);

router.get('/forgotPassword', authController.getForgotPassword);

router.post('/forgotPassword', authController.postForgotPassword);

router.get('/authCode', authController.getAuthCode)

router.post('/authCode', authController.postAuthCode)

router.get('/resetPassword', authController.getResetPassword);

router.post('/resetPassword', authController.postResetPassword);

module.exports = router;
