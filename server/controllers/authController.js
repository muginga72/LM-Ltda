const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Register user (always as "user")
const signup = async (req, res) => {
  try {
    const { fullName, email, password, avatar } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Force role to "user"
    const user = await User.create({
      fullName,
      email,
      password,     // hashed by pre-save hook
      role: 'user',
      avatar,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = (req.user && (req.user.id || req.user._id)) || null;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password) delete user.password;
    return res.json({ user });
  } catch (err) {
    console.error("Get current user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.json({ message: 'Logged out' });
};

module.exports = { signup, login, logout, getCurrentUser };