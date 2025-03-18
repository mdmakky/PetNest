const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateJWT = require('../utils/authentication');

router.post("/addBlog", authenticateJWT, blogController.addBlog);
router.get("/getBlog",  blogController.getBlogs);
router.get("/myBlogs", authenticateJWT,  blogController.myBlogs);
router.post("/:blogId/comments", authenticateJWT, blogController.addComment)

module.exports = router;