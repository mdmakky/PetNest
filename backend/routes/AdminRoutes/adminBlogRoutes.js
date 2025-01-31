const express = require('express');
const router = express.Router();
const adminBlogController = require('../../controllers/AdminControllers/adminBlogController');
const authenticateJWT = require('../../utils/authentication');

router.get('/getBlog', authenticateJWT, adminBlogController.getBlogs);
router.put("/approve/:id", authenticateJWT, adminBlogController.approveBlog);
router.delete("/decline/:id", authenticateJWT, adminBlogController.declineBlog);

module.exports = router;