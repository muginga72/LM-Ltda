// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const ServiceSchedule = require('../models/ServiceSchedule');
const roomsController = require('../controllers/roomrental/roomsController');

function assertIsFunction(name, value) {
  if (typeof value !== 'function') {
    throw new Error(`Invalid import: "${name}" must be a function but got "${typeof value}".`);
  }
}
if (!protect || !adminOnly) {
  throw new Error('Invalid import: middleware/authMiddleware must export { protect, adminOnly }');
}
assertIsFunction('protect', protect);
assertIsFunction('adminOnly', adminOnly);
assertIsFunction('roomsController.getRooms', roomsController.getRooms);
assertIsFunction('roomsController.createRoom', roomsController.createRoom);
assertIsFunction('roomsController.updateRoom', roomsController.updateRoom);
assertIsFunction('roomsController.deleteRoom', roomsController.deleteRoom);

/**
 * Multer setup for room image uploads
 */
const uploadDir = path.join(__dirname, '..', 'uploads', 'rooms');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/promote', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only allow promoting the designated admin account
    const allowedName = 'Laurindo Muginga';
    const allowedEmail = process.env.ADMIN_EMAIL;
    if (user.name !== allowedName && user.email !== allowedEmail) {
      return res.status(403).json({ message: 'Only Laurindo can be admin' });
    }

    user.role = 'admin';
    user.isAdmin = true;
    await user.save();
    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    console.error('Error promoting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/update-status/:serviceId', protect, adminOnly, async (req, res) => {
  const { serviceId } = req.params;
  const { status } = req.body;

  if (!['paid', 'pending', 'unpaid'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const paid = status === 'paid';

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
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: 'Status updated successfully.', updated });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
});

// All routes require protect then adminOnly (protect must run first so req.user exists).
router.get('/rooms', protect, adminOnly, roomsController.getRooms);
router.post('/rooms', protect, adminOnly, upload.array('roomImages', 8), roomsController.createRoom);
router.put('/rooms/:id', protect, adminOnly, upload.array('roomImages', 8), roomsController.updateRoom);
router.delete('/rooms/:id', protect, adminOnly, roomsController.deleteRoom);

module.exports = router;