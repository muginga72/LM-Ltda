const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Example: Get all users (admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Example: Promote user to admin
router.put('/users/:id/promote', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = 'admin';
  await user.save();
  res.json({ message: 'User promoted to admin', user });
});

module.exports = router;