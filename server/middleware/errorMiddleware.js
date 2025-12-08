module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  // multer file validation errors
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Uploaded file too large' });
  }
  if (err && err.message && err.message.includes('Only JPEG/PNG images and PDF documents')) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
};