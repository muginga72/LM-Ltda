const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");       // Folder where files are stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload endpoint
router.post("/upload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`, // relative path
  })
})

module.exports = router;