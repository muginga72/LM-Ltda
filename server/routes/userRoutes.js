// server/routes/roomrental/roomRoutes.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
    cb(null, true);
  },
});

router.post('/', upload.array('images', 12), async (req, res, next) => {
  try {
    const roomData = {
      roomTitle: req.body.roomTitle,
      roomDescription: req.body.roomDescription,
      roomCapacity: Number(req.body.roomCapacity) || 1,
      bedrooms: Number(req.body.bedrooms) || 1,
      bathrooms: Number(req.body.bathrooms) || 1,
      pricePerNight: req.body.pricePerNight ? JSON.parse(req.body.pricePerNight) : undefined,
      amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
      rules: req.body.rules ? JSON.parse(req.body.rules) : [],
      minNights: Number(req.body.minNights) || 1,
      maxNights: Number(req.body.maxNights) || 30,
      instantBook: req.body.instantBook === 'true',
      roomLocation: req.body.roomLocation ? JSON.parse(req.body.roomLocation) : {},
      images: (req.files || []).map((f) => `/uploads/${path.basename(f.path)}`),
      createdAt: new Date(),
    };
    return res.status(201).json({ success: true, room: roomData });
  } catch (err) {
    next(err);
  }
});

// Example GET /api/rooms (simple list)
router.get('/', async (req, res, next) => {
  try {
    return res.json([]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;