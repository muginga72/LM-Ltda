// routes/adminRoutes.js
const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const ServiceSchedule = require('../models/ServiceSchedule');
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

// PATCH /api/admin/update-status/:serviceId
router.patch("/update-status/:serviceId", async (req, res) => {
  const { serviceId } = req.params;
  const { status } = req.body;

  if (!["paid", "pending", "unpaid"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const paid = status === "paid";

    // Try updating in ServiceRequest
    let updated = await ServiceRequest.findByIdAndUpdate(
      serviceId,
      { status, paid },
      { new: true }
    );

    // If not found, try ServiceSchedule
    if (!updated) {
      updated = await ServiceSchedule.findByIdAndUpdate(
        serviceId,
        { status, paid },
        { new: true }
      );
    }

    if (!updated) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ message: "Status updated successfully.", updated });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error while updating status." });
  }
});

module.exports = router;