// server/routes/userRoutes.js
const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const { updateProfile } = require('../controllers/userController');
const { getUserRequests, getUserSchedules } = require("../controllers/userController.js");
const { authenticate } = require("../middleware/authMiddleware.js");

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/users/signup
router.post('/signup', signup);

// POST /api/users/login
router.post('/login', login);

// POST /api/users/logout
router.post('/logout', logout);
router.put('/profile', protect, updateProfile);
router.get("/requests", authenticate, getUserRequests);
router.get("/schedules", authenticate, getUserSchedules);

module.exports = router;