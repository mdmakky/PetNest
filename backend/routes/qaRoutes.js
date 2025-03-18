const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qaController');
const authenticateJWT = require('../utils/authentication');


router.get("/getQuestions",  qaController.getQuestions);
router.get("/getMyQuestions", authenticateJWT, qaController.getMyQuestions);
router.post("/addQuestion", authenticateJWT, qaController.addQuestion);
router.post("/:questionId/answers", authenticateJWT, qaController.addAnswer)
router.post("/:questionId/:answerId/like", authenticateJWT, qaController.like)
router.post("/:questionId/:answerId/dislike", authenticateJWT, qaController.dislike)

module.exports = router;