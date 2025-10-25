const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const requestController = require('../controllers/requestController');

// Setup multer for image uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

// Serve uploaded images
router.use('/uploads', express.static(uploadsDir));

// Routes
router.post('/', upload.single('image'), requestController.createRequest);
router.get('/', requestController.listRequests);
router.get('/:id', requestController.getRequestById);
router.patch('/:id', requestController.updateRequest);
router.delete('/:id', requestController.deleteRequest);
router.post('/:id/image', upload.single('image'), requestController.uploadRequestImage);

module.exports = router;