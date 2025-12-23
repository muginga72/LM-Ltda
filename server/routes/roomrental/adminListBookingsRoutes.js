// routes/roomrental/adminBookings.js
const express = require('express');
const router = express.Router();
const adminListBookingsController = require('../../controllers/roomrental/adminListBookingsController');

/**
 * Replace this placeholder with your real authentication middleware.
 * It should set req.user and ensure req.user.role === 'admin' for admin routes.
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

// GET /admin/bookings?tab=all|paid|cancelled&page=1
router.get('/bookings/admin', requireAdmin, adminListBookingsController.listBookingsAdmin);

module.exports = router;