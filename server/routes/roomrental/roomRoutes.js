// routes/roomrental/roomRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Use exact path and case for your project
const roomsController = require('../../controllers/roomrental/roomsController');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

// Quick runtime checks to fail fast with clear message if imports are wrong
if (!roomsController || typeof roomsController !== 'object') {
  throw new Error('Invalid import: controllers/roomrental/roomsController must export an object');
}
if (typeof protect !== 'function' || typeof adminOnly !== 'function') {
  throw new Error('Invalid import: middleware/authMiddleware must export { protect, adminOnly } functions');
}
['getRooms', 'createRoom', 'updateRoom', 'deleteRoom'].forEach(fn => {
  if (typeof roomsController[fn] !== 'function') {
    throw new Error(`Invalid export: roomsController.${fn} must be a function`);
  }
});

// Multer setup
const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'rooms');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// Routes: protect must run before adminOnly so req.user exists
router.get('/', protect, roomsController.getRooms); // public or authenticated list
router.post('/', protect, adminOnly, upload.array('roomImages', 8), roomsController.createRoom);
router.put('/:id', protect, adminOnly, upload.array('roomImages', 8), roomsController.updateRoom);
router.delete('/:id', protect, adminOnly, roomsController.deleteRoom);

module.exports = router;