const express = require('express');
const router = express.Router();
const adminLoginController = require('../../controllers/AdminControllers/adminLoginController');

router.post('/adminLogin', adminLoginController.postLogin);

module.exports = router;