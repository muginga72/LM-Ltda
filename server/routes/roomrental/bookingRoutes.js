// // routes/roomrental/bookingRoutes.js
// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const fs = require("fs");
// const multer = require("multer");

// const bookingsController = require("../../controllers/roomrental/bookingsController");
// const { protect, adminOnly } = require("../../middleware/authMiddleware");

// // Validate controller export shape for bookings
// if (!bookingsController || typeof bookingsController !== "object") {
//   throw new Error("Invalid import: controllers/roomrental/bookingsController must export an object");
// }

// const expectedFns = [
//   "listBookings",
//   "getBooking",
//   "createBooking",
//   "confirmPayment",
//   "cancelBooking",
//   "checkAvailability",
// ];

// expectedFns.forEach((fn) => {
//   if (typeof bookingsController[fn] !== "function") {
//     throw new Error(`Invalid export: bookingsController.${fn} must be a function`);
//   }
// });

// // Ensure upload directory exists for booking documents
// const uploadDir = path.join(__dirname, "..", "..", "uploads", "bookings");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // Multer storage for idDocument uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
//     cb(null, unique);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
// });

// // Routes
// router.get("/", protect, bookingsController.listBookings);
// router.get("/:id", protect, bookingsController.getBooking);
// router.post("/", protect, upload.single("idDocument"), bookingsController.createBooking);
// router.post("/confirm", protect, bookingsController.confirmPayment);
// router.post("/:id/cancel", protect, bookingsController.cancelBooking);
// router.get("/:id/availability", protect, bookingsController.checkAvailability);

// module.exports = router;


// routes/roomrental/bookingRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const bookingsController = require("../../controllers/roomrental/bookingsController");
const { protect, adminOnly } = require("../../middleware/authMiddleware");

// Validate controller export shape for bookings
if (!bookingsController || typeof bookingsController !== "object") {
  throw new Error("Invalid import: controllers/roomrental/bookingsController must export an object");
}

const expectedFns = [
  "listBookings",
  "getBooking",
  "createBooking",
  "confirmPayment",
  "cancelBooking",
  "checkAvailability",
];

expectedFns.forEach((fn) => {
  if (typeof bookingsController[fn] !== "function") {
    throw new Error(`Invalid export: bookingsController.${fn} must be a function`);
  }
});

// Ensure upload directory exists for booking documents
const uploadDir = path.join(__dirname, "..", "..", "uploads", "bookings");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage for idDocument uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Routes

// List bookings for the authenticated user (convenience route).
// We reuse the existing listBookings controller by injecting req.query.userId
// so the controller can filter by user if it supports query-based filtering.
router.get("/api/bookings/my", protect, (req, res, next) => {
  try {
    // Ensure req.user is present (protect middleware should set it)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Inject userId into query so the existing controller can filter results.
    // If your controller expects a different key (e.g., req.userId), adapt accordingly.
    req.query = req.query || {};
    req.query.userId = req.user._id.toString ? req.user._id.toString() : req.user._id;

    // Delegate to the controller's listBookings function
    return bookingsController.listBookings(req, res, next);
  } catch (err) {
    return next(err);
  }
});

// Check availability for a specific booking id (specific route before param route)
router.get("/:id/availability", protect, bookingsController.checkAvailability);

// Get a single booking by id
router.get("/:id", protect, bookingsController.getBooking);

// Create a booking (accepts multipart/form-data with optional idDocument)
router.post("/", protect, upload.single("idDocument"), bookingsController.createBooking);

// Confirm payment for a booking
router.post("/confirm", protect, bookingsController.confirmPayment);

// Cancel a booking
router.post("/:id/cancel", protect, bookingsController.cancelBooking);

// List all bookings (admin or filtered by query)
// Keep this at the root path; protect middleware will ensure authentication
router.get("/", protect, bookingsController.listBookings);

module.exports = router;