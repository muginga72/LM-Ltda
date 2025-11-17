// const express = require("express");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");       // Folder where files are stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage });

// // Upload endpoint
// router.post("/upload", upload.single("document"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   res.json({
//     message: "File uploaded successfully",
//     filePath: `/uploads/${req.file.filename}`, // relative path
//   })
// })

// module.exports = router;

// server/routes/uploadFilesRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Multer storage: save with timestamp + original extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const name = `${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

// single file upload endpoint: returns path usable by frontend
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the public path (frontend should store/use this)
  const publicPath = `/uploads/${req.file.filename}`;
  res.json({ path: publicPath, filename: req.file.filename });
});

module.exports = router; 