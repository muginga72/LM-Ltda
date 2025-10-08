// server/routes/authRoutes.js
const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { register, login, logout } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout);

// module.exports = router;