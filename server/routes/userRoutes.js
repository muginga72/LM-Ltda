// server/routes/userRoutes.js
const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const {
  getProfile,
  updateProfile,
  getUserRequests,
  getUserSchedules
} = require('../controllers/userController');
const { upload } = require('../config/multerConfig');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// GET /api/users/profile
router.get("/profile", protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/requests', protect, getUserRequests);
router.get('/schedules', protect, getUserSchedules);

module.exports = router;