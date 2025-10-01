// routes/adminRoutes.js
const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get all users (only Laurindo as admin can access)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Promote user to admin (only Laurindo can be admin)
router.put('/users/:id/promote', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Block promoting anyone else
    if (user.name !== 'Laurindo Muginga' && user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Only Laurindo can be admin' });
    }

    user.role = 'admin';
    await user.save();
    res.json({ message: 'Laurindo confirmed as admin', user });
  } catch (err) {
    console.error('Error promoting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;