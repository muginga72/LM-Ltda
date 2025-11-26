// routes/roomrental/bookings.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Controllers
const {
  createBooking,
  getBooking,
  listBookings,
  cancelBooking
} = require('../../controllers/roomrental/bookingsController');

// Middleware
const { protect, adminOnly } = require('../../middleware/authMiddleware');

const multer = require('multer');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../uploads/idDocuments');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Create a booking (multipart/form-data with idDocument)
router.post('/', protect, upload.single('idDocument'), createBooking);
router.get('/my', protect, listBookings);

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

// Generic list (optional): return a paginated list for admins (kept before :id)
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const Booking = require('../../models/roomrental/Booking');
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Booking.find()
        .populate('room')
        .populate('guest', 'name email')
        .populate('host', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments()
    ]);

    res.json({ data: items, meta: { page, limit, total } });
  } catch (err) {
    next(err);
  }
});

// Get a booking by ID (/:id) - must be after literal routes
router.get('/:id', protect, getBooking);

router.delete('/:id', protect, cancelBooking);

module.exports = router;