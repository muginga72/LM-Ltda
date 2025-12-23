// controllers/roomrental/adminBookingsController.js
const mongoose = require('mongoose');
const Booking = require('../../models/roomrental/Booking');

async function listBookingsAdmin(req, res, next) {
  try {
    // Basic admin guard (replace with your real auth/role check)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const tab = (req.query.tab || 'all').toLowerCase();
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = 50;
    const skip = (page - 1) * limit;

    const filter = {};

    if (tab === 'paid') {
      // paid bookings: paymentInfo.paidAt exists (non-null)
      filter['paymentInfo.paidAt'] = { $exists: true, $ne: null };
    } else if (tab === 'cancelled') {
      filter.status = 'cancelled';
    } // else 'all' -> no extra filter

    // Optionally allow searching by room/guest via query params
    if (req.query.roomId && mongoose.isValidObjectId(req.query.roomId)) {
      filter.room = req.query.roomId;
    }
    if (req.query.guestId && mongoose.isValidObjectId(req.query.guestId)) {
      filter.guest = req.query.guestId;
    }

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter).exec(),
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('room', 'roomTitle title name pricePerNight')
        .populate('guest', 'name email')
        .populate('host', 'name email')
        .lean()
        .exec(),
    ]);

    return res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      bookings,
    });
  } catch (err) {
    console.error('listBookingsAdmin error:', err);
    next(err);
  }
}

module.exports = {
  listBookingsAdmin,
};