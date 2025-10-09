// server/routes/authRoutes.js
const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/register', signup);  // alias for frontend
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;