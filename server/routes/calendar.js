// server/routes/calendar.js

const express = require('express');
const router = express.Router();
const { getAvailability } = require('../controllers/calendarAvailabilityController');

// Import verifyToken correctly (supports both default and named export)
let verifyToken = require('../middleware/authenticate');
if (verifyToken && verifyToken.verifyToken) {
  verifyToken = verifyToken.verifyToken;
}
if (typeof verifyToken !== 'function') {
  verifyToken = (req, res, next) => next();
}

const Event = require('../models/Event');

// GET /api/calendar/availability
router.get('/availability', getAvailability);

// GET /api/calendar/events — user’s events
router.get('/events', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing user context' });
    }

    const events = await Event.find({ userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/calendar/events/:id — single event
router.get('/events/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

module.exports = router;