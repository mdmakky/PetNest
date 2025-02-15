const express = require('express');
const router = express.Router();
const adminDoctorController = require('../../controllers/AdminControllers/adminDoctorController');
const authenticateJWT = require('../../utils/authentication');

router.get('/getDoctor', authenticateJWT, adminDoctorController.getDoctors);
router.put("/approve/:id", authenticateJWT, adminDoctorController.approveDoctor);
router.delete("/decline/:id", authenticateJWT, adminDoctorController.declineDoctor);

module.exports = router;