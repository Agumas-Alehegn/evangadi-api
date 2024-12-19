const express = require("express");
const router = express.Router();
const {
  postQuestion,
  getQuestions,
  getSingleQuestions,
} = require("../controller/questionControl");
const verifyToken = require("../middle_ware/authMiddleWare");

// questions route
router.post("/question", verifyToken, postQuestion);
router.get("/question", verifyToken, getQuestions);
router.get("/question/:id", verifyToken, getSingleQuestions);
module.exports = router;
