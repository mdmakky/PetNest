const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/AdminControllers/AdminUserController');
const authenticateJWT = require('../../utils/authentication');

router.get('/getUser', authenticateJWT, adminUserController.getUser);
router.delete("/removeUser/:id", authenticateJWT, adminUserController.removeUser);

module.exports = router;