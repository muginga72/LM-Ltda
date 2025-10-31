const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const db = require('../models');

module.exports = (io) => {
  router.post('/schedule', verifyAdmin, async (req, res) => {
    const { title, date, time, userId } = req.body;
    try {
      const event = await db.Event.create({
        title,
        date,
        time,
        userId,
        createdByAdmin: true,
      });

      io.to(`user-${userId}`).emit('calendarUpdate', event);
      res.json({ success: true, event });
    } catch (err) {
      res.status(500).json({ error: 'Failed to schedule event' });
    }
  });

  return router;
};