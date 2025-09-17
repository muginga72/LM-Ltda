const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include name, email, and password');
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  if (!user) {
    res.status(500);
    throw new Error('Failed to create user');
  }

  // Respond with token
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Respond with token
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name   = req.body.name   || user.name;
  user.email  = req.body.email  || user.email;
  user.avatar = req.body.avatar || user.avatar;

  const updated = await user.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    avatar: updated.avatar
  });
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/users/logout
// @access  Public
exports.logout = asyncHandler(async (req, res) => {
  // With JWT, logout is handled client-side by deleting the token
  res.json({ message: 'Logged out successfully' });
});