// server/config/multerConfig.js
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Directory to store uploaded avatars (ensure this exists or create at runtime)
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "avatars");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Use a safe filename: userId + timestamp + ext
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const userId = (req.user && (req.user.id || req.user._id)) || "anon";
    const name = `${userId}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image uploads are allowed"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB max
  },
});

module.exports = {
  upload,
  UPLOAD_DIR,
};