// server/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Allowed mime types
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const DOC_MIMES = ['application/pdf', 'image/jpeg', 'image/png'];

// Helper to create safe filename
function makeSafeFilename(originalName) {
  const safeName = originalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return `${uniqueSuffix}-${safeName}`;
}

// Combined storage logic: choose folder by fieldname first, then by route fallback
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Fieldname -> folder mapping
    const fieldMap = {
      roomImages: 'uploads/rooms',
      bookingImages: 'uploads/bookings',
      id: 'uploads/ids',
      passport: 'uploads/passports',
      paymentReceipt: 'uploads/payments',
      serviceFile: 'uploads/services',
    };

    // Default folder if no field match
    let folder = fieldMap[file.fieldname];

    // If no mapping by field, try to infer from route (req.baseUrl)
    if (!folder && req && req.baseUrl) {
      if (req.baseUrl.includes('/payments')) folder = 'uploads/payments';
      else if (req.baseUrl.includes('/services')) folder = 'uploads/services';
      else if (req.baseUrl.includes('/rooms')) folder = 'uploads/rooms';
      else if (req.baseUrl.includes('/bookings')) folder = 'uploads/bookings';
    }

    // Final fallback
    if (!folder) folder = 'uploads/misc';

    // Place uploads at project root /uploads
    const fullPath = path.join(__dirname, '..', folder);
    fs.mkdirSync(fullPath, { recursive: true });
    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    cb(null, makeSafeFilename(file.originalname));
  },
});

// File filter enforces allowed types per field
const fileFilter = (req, file, cb) => {
  // Images for room and booking
  if (file.fieldname === 'roomImages' || file.fieldname === 'bookingImages' || file.fieldname === 'bookingPhotos') {
    if (IMAGE_MIMES.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Only image files are allowed for room or booking images'));
  }

  // ID or passport can be image or PDF
  if (file.fieldname === 'id' || file.fieldname === 'passport') {
    if (DOC_MIMES.includes(file.mimetype) || file.mimetype === 'application/pdf') return cb(null, true);
    return cb(new Error('ID or passport must be PDF or an image'));
  }

  // Payment receipts and service files: allow images and PDFs
  if (file.fieldname === 'paymentReceipt' || file.fieldname === 'serviceFile') {
    if (DOC_MIMES.includes(file.mimetype) || file.mimetype === 'application/pdf') return cb(null, true);
    return cb(new Error('Payment receipts and service files must be PDF or image'));
  }

  // Default allow for unknown fields (optional)
  cb(null, true);
};

// Limits
const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB per file
  files: 20,
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;