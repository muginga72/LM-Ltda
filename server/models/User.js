// server/models/User.js
const mongoose = require('mongoose');
// const { updateProfile } = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// router.put('/profile', protect, updateProfile);

module.exports = mongoose.model('User', userSchema);