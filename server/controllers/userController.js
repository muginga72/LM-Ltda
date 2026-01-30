// server/controllers/userController.js
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const ServiceRequest = require("../models/ServiceRequest");
const ServiceSchedule = require("../models/ServiceSchedule");
const { UPLOAD_DIR } = require("../config/multerConfig");

/**
 * getProfile
 * - Returns the authenticated user's profile
 * - Requires auth middleware to set req.user (id/_id)
 */
const getProfile = async (req, res) => {
  try {
    const userId = (req.user && (req.user.id || req.user._id)) || null;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password) delete user.password;
    return res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const body = req.body || {};
    const { fullName, email, phone } = body;

    const userId =
      (req.user && (req.user.id || req.user._id)) ||
      (req.params && (req.params.id || req.params.userId)) ||
      null;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof fullName === "string" && fullName.trim() !== "") {
      user.fullName = fullName.trim();
    }
    if (typeof email === "string" && email.trim() !== "") {
      user.email = email.trim();
    }
    if (typeof phone === "string") {
      user.phone = phone.trim();
    }

    if (req.file) {
      const filename = path.basename(req.file.path || req.file.filename);
      const protocol = req.protocol || "http";
      const host = req.get("host");
      const avatarUrl = `${protocol}://${host}/uploads/avatars/${filename}`;

      try {
        const prev = user.avatarUrl || user.avatar;
        if (prev && prev.includes("/uploads/avatars/")) {
          const prevFilename = prev.split("/uploads/avatars/").pop();
          const prevPath = path.join(UPLOAD_DIR, prevFilename);
          if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath);
        }
      } catch (err) {
        console.warn("Failed to remove previous avatar:", err.message);
      }

      user.avatarUrl = avatarUrl;
      user.avatar = avatarUrl;
    }

    const updatedUser = await user.save();
    const safeUser = updatedUser.toObject();
    if (safeUser.password) delete safeUser.password;

    return res.json({ user: safeUser });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const userId =
      (req.user && (req.user.id || req.user._id)) ||
      (req.params && (req.params.id || req.params.userId)) ||
      null;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const requests = await ServiceRequest.find({ userId }).lean();
    const scheduled = requests.filter((r) => r.status === "confirmed");
    const past = requests.filter((r) =>
      ["completed", "expired", "cancelled"].includes(r.status)
    );

    res.json({ requests, scheduled, past });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ message: "Failed to fetch requests." });
  }
};

const getUserSchedules = async (req, res) => {
  try {
    const userId =
      (req.user && (req.user.id || req.user._id)) ||
      (req.params && (req.params.id || req.params.userId)) ||
      null;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const schedules = await ServiceSchedule.find({ userId }).lean();
    const scheduled = schedules.filter((s) => s.status === "confirmed");
    const past = schedules.filter((s) =>
      ["completed", "expired", "cancelled"].includes(s.status)
    );

    res.setHeader("Cache-Control", "no-store");
    res.json({ scheduled, past });
  } catch (error) {
    console.error("Error fetching user schedules:", error);
    res.status(500).json({ message: "Failed to fetch schedules." });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserRequests,
  getUserSchedules,
};