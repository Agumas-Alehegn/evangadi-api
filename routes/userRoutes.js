const express = require("express");
const router = express.Router();

const { register, login, checkUser } = require("../controller/userControl");
const verifyToken = require("../middle_ware/authMiddleWare");

router.post("/register", register);
router.post("/login", login);
router.get("/check", verifyToken, checkUser);
module.exports = router;
