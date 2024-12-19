const express = require("express");
const router = express.Router();
const { postAnswer, getAnswers } = require("../controller/answerControl");
const verifyToken = require("../middle_ware/authMiddleWare");
router.post("/answer/:question_id", verifyToken, postAnswer);
router.get("/answer/:id", verifyToken, getAnswers);

module.exports = router;
