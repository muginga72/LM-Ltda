// server/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamically choose upload folder based on field or route
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads'; // default fallback

    // You can switch based on route or fieldname
    if (req.baseUrl.includes('/payments')) {
      folder = 'uploads/payments';
    } else if (req.baseUrl.includes('/services')) {
      folder = 'uploads/services';
    }

    const fullPath = path.join(__dirname, folder);

    // Ensure the folder exists
    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;