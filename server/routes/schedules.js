const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const scheduleController = require('../controllers/scheduleController');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

// Serve uploads (including default.png) before dynamic routes
router.use('/uploads', express.static(uploadsDir));

router.post('/', upload.single('image'), scheduleController.createSchedule);
router.get('/', scheduleController.listSchedules);
router.get('/:id', scheduleController.getScheduleById);
// router.patch('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);
router.post('/:id/image', upload.single('image'), scheduleController.uploadScheduleImage);

module.exports = router;