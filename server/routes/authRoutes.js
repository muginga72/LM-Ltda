// server/routes/authRoutes.js
const express = require('express');
const { signup, login, logout, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/signup', signup);
router.post('/register', signup);  // alias for frontend
router.post('/login', login);
router.post('/logout', logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;