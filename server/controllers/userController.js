const User = require('../models/User');
const ServiceRequest = require("../models/ServiceRequest.js");
const ServiceSchedule = require("../models/ServiceSchedule.js");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, email, avatar, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.userName = fullName || user.fullName;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;
    user.phone = avatar || user.phone;

    const updatedUser = await user.save();

    res.json({
      userName: updatedUser.fullName,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ServiceRequest.find({ userId });
    const scheduled = requests.filter(r => r.status === "confirmed");
    const past = requests.filter(r => ["completed", "expired"].includes(r.status));

    res.json({ requests, scheduled, past });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ message: "Failed to fetch requests." });
  }
};

const getUserSchedules = async (req, res) => {
  try {
    const userId = req.user._id;

    const schedules = await ServiceSchedule.find({ userId });
    const scheduled = schedules.filter(s => s.status === "confirmed");
    const past = schedules.filter(s => ["completed", "expired"].includes(s.status));

    res.setHeader("Cache-Control", "no-store"); // 👈 Prevent caching
    res.json({ scheduled, past });
  } catch (error) {
    console.error("Error fetching user schedules:", error);
    res.status(500).json({ message: "Failed to fetch schedules." });
  }
};

module.exports = {
  updateProfile,
  getUserRequests,
  getUserSchedules,
};