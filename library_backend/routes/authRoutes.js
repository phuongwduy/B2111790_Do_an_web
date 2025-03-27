const express = require("express");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// API Đăng ký & Đăng nhập
router.post("/register", register);
router.post("/login", login);

  
module.exports = router;
