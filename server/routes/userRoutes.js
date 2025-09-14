// server/routes/userRoutes.js
const express = require('express');
const { signup, login, logout } = require('../controllers/authController');

const router = express.Router();

// POST /api/users/signup
router.post('/signup', signup);

// POST /api/users/login
router.post('/login', login);

// POST /api/users/logout
router.post('/logout', logout);

module.exports = router;