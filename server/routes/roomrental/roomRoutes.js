// server/routes/roomrental/roomRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const authModule = require('../../middleware/authMiddleware');

const authenticate = typeof authModule === 'function' ? authModule : authModule.authenticate;
const requireAdmin = authModule && authModule.requireAdmin
  ? authModule.requireAdmin
  : (req, res, next) => {
      if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
      next();
    };

// sanity check
if (typeof authenticate !== 'function' || typeof requireAdmin !== 'function') {
  console.error('authModule:', authModule);
  throw new Error('authenticate or requireAdmin is not a function. Check middleware/auth.js exports and require path.');
}

const controller = require('../../controllers/roomrental/roomsController'); // adjust path if needed

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/rooms')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();

// apply auth middleware to all routes in this router
router.use(authenticate, requireAdmin);

router.get('/', controller.listRooms);
router.get('/:id', controller.getRoom);
router.post('/', upload.array('images', 10), controller.createRoom);
router.put('/:id', upload.array('images', 10), controller.updateRoom);
router.delete('/:id', controller.deleteRoom);

module.exports = router;