const express = require('express');
const router = express.Router();

// POST /api/room-requests
router.post('/', async (req, res) => {
  const { title, details, preferredLocation, contact, images } = req.body;

  // Basic validation
  if (!title || !contact) {
    return res.status(400).json({ message: "Title and contact are required." });
  }

  // Save to DB (replace with your DB logic)
  const saved = {
    id: Date.now(),
    title,
    details,
    preferredLocation,
    contact,
    images: images || [],
  };

  console.log("Room request received:", saved);
  return res.status(201).json({ message: "Request received", request: saved });
});

module.exports = router;