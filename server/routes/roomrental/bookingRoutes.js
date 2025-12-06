// routes/roomrental/bookingsRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const bookingsController = require('../../controllers/roomrental/bookingsController');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

// Basic runtime validation of imports
if (!bookingsController || typeof bookingsController !== 'object') {
  throw new Error('Invalid import: controllers/roomrental/bookingsController must export an object');
}
[
  'getRooms',
  'checkAvailability',
  'createBooking',
  'confirmPayment',
  'getBooking',
  'listBookings',
  'cancelBooking',
].forEach((fn) => {
  if (typeof bookingsController[fn] !== 'function') {
    throw new Error(`Invalid export: bookingsController.${fn} must be a function`);
  }
});
if (typeof protect !== 'function' || typeof adminOnly !== 'function') {
  throw new Error('Invalid import: middleware/authMiddleware must export { protect, adminOnly } functions');
}

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads', 'idDocuments');
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

// Accept images and PDFs only, limit size to 6MB
const fileFilter = (req, file, cb) => {
  if (!file || !file.mimetype) return cb(new Error('Invalid file'), false);
  const allowed = ['image/', 'application/pdf'];
  const ok = allowed.some((p) => file.mimetype.startsWith(p));
  if (!ok) return cb(new Error('Only image files or PDF are allowed for ID documents'), false);
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter,
});

// GET /api/bookings/rooms - list rooms (passthrough)
router.get('/rooms', protect, bookingsController.getRooms);

// POST /api/bookings/confirm  -> confirm payment (admin)
// Body: { bookingId, paidAt (optional) }
router.post('/confirm', protect, adminOnly, bookingsController.confirmPayment);

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

// Generic list (optional): return a paginated list for admins
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

// GET /api/bookings/my - list bookings for logged-in user
router.get('/my', protect, bookingsController.listBookings);

// Create a booking (multipart/form-data with idDocument)
// Expects field 'idDocument' for the uploaded ID/passport
router.post('/', protect, upload.single('idDocument'), bookingsController.createBooking);

// GET /api/bookings/:id/availability?startDate=...&endDate=...
router.get('/:id/availability', protect, bookingsController.checkAvailability);

// Get a booking by ID (/:id) - must be after literal routes
router.get('/:id', protect, bookingsController.getBooking);

// DELETE /api/bookings/:id  -> cancel booking (guest or admin)
router.delete('/:id', protect, bookingsController.cancelBooking);

module.exports = router;