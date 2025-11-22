const express = require('express');
const router = express.Router();

// Controllers
const {
  createBooking,
  getBooking,
  listBookings,
  cancelBooking
} = require('../../controllers/roomrental/bookingsController');

// Middleware
const { protect, adminOnly } = require('../../middleware/authMiddleware');

// File upload middleware (multer)
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/idDocuments'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ------------------- ROUTES -------------------

router.post('/', protect, upload.single('idDocument'), createBooking);

// Get a booking by ID (requires auth)
router.get('/:id', protect, getBooking);
router.get('/', protect, listBookings);
router.delete('/:id', protect, cancelBooking);

// Admin-only route: list all bookings in the system
router.get('/admin/all', protect, adminOnly, async (req, res, next) => {
  try {
    const Booking = require('../../models/roomrental/Booking');
    const bookings = await Booking.find()
      .populate('room')
      .populate('guest', 'name email')
      .populate('host', 'name email');
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;