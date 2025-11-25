// server/routes/uploads.js
const express = require('express');
const path = require('path');
const upload = require('../ulpoads');
const router = express.Router();

// Fields we expect across forms
const fields = [
  { name: 'roomImages', maxCount: 8 },
  { name: 'bookingImages', maxCount: 8 },
  { name: 'id', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'paymentReceipt', maxCount: 3 },
  { name: 'serviceFile', maxCount: 5 },
];

// Generic combined upload endpoint used by room form booking modal services and payments
router.post('/upload-docs', (req, res) => {
  const uploader = upload.fields(fields);
  uploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // Build response with accessible URLs
    const files = {};
    if (req.files) {
      for (const field in req.files) {
        files[field] = req.files[field].map((f) => {
          // Determine public URL path relative to static mount
          // We assume app serves /uploads -> <projectRoot>/uploads
          // Derive folder name from file.path
          const relPath = path.relative(path.join(__dirname, '..', '..', 'uploads'), f.path);
          const url = `/uploads/${relPath.replace(/\\/g, '/')}`;
          return {
            originalName: f.originalname,
            filename: f.filename,
            mimeType: f.mimetype,
            size: f.size,
            url,
          };
        });
      }
    }

    return res.json({ success: true, files });
  });
});

// Optional: separate endpoints for rooms or services if you prefer
router.post('/rooms/upload', (req, res) => {
  // reuse same fields but typically only roomImages and maybe serviceFile
  const uploader = upload.fields([{ name: 'roomImages', maxCount: 8 }, { name: 'serviceFile', maxCount: 3 }]);
  uploader(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    // build response same as above
    const files = {};
    if (req.files) {
      for (const field in req.files) {
        files[field] = req.files[field].map((f) => {
          const relPath = path.relative(path.join(__dirname, '..', '..', 'uploads'), f.path);
          const url = `/uploads/${relPath.replace(/\\/g, '/')}`;
          return { originalName: f.originalname, filename: f.filename, mimeType: f.mimetype, size: f.size, url };
        });
      }
    }
    return res.json({ success: true, files });
  });
});

module.exports = router;