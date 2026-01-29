// server/controllers/userController.js
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { UPLOAD_DIR } = require("../config/multerConfig");

/**
 * updateProfile
 * - Accepts JSON or multipart/form-data (with optional file field 'avatar')
 * - Requires auth middleware to set req.user (id/_id)
 * - Returns { user: updatedUser } on success
 */
const updateProfile = async (req, res) => {
  try {
    // Defensive: req.body may be undefined for multipart requests
    const body = req.body || {};

    // Extract fields safely from body
    const { fullName, email, phone } = body;

    // Identify user id from auth middleware
    const userId = (req.user && (req.user.id || req.user._id)) || req.params.id || null;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("+password"); // include password only if needed elsewhere
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update simple fields if provided
    if (typeof fullName === "string" && fullName.trim() !== "") user.fullName = fullName.trim();
    if (typeof email === "string" && email.trim() !== "") user.email = email.trim();
    if (typeof phone === "string") user.phone = phone.trim();

    // Handle avatar upload (multer places file in req.file)
    if (req.file) {
      // Build a public URL for the uploaded file. Adjust if serving from CDN.
      const filename = path.basename(req.file.path);
      const protocol = req.protocol || "http";
      const host = req.get("host");
      const avatarUrl = `${protocol}://${host}/uploads/avatars/${filename}`;

      // Optionally remove previous avatar file from disk (if stored locally)
      if (user.avatar || user.avatarUrl) {
        try {
          const prev = user.avatarUrl || user.avatar;
          if (prev && prev.includes("/uploads/avatars/")) {
            const prevFilename = prev.split("/uploads/avatars/").pop();
            const prevPath = path.join(UPLOAD_DIR, prevFilename);
            if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath);
          }
        } catch (err) {
          // ignore deletion errors
          console.warn("Failed to remove previous avatar:", err.message);
        }
      }

      // Save the new avatar URL on the user
      user.avatarUrl = avatarUrl;
      // also keep legacy field if your frontend expects `avatar`
      user.avatar = avatarUrl;
    }

    const updatedUser = await user.save();

    // Remove sensitive fields before returning
    const safeUser = updatedUser.toObject();
    delete safeUser.password;

    return res.json({ user: safeUser });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ServiceRequest.find({ userId });
    const scheduled = requests.filter((r) => r.status === "confirmed");
    const past = requests.filter((r) => ["completed", "expired"].includes(r.status));

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
    const scheduled = schedules.filter((s) => s.status === "confirmed");
    const past = schedules.filter((s) => ["completed", "expired"].includes(s.status));

    res.setHeader("Cache-Control", "no-store"); // Prevent caching
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