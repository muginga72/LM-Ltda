// routes/adminCalendar.js
const express = require('express');
const calendarControllerFactory = require('../controllers/calendarController');

module.exports = (io) => {
  const router = express.Router();
  const controller = calendarControllerFactory(io);

  router.post('/', controller.createEvent);
  router.get('/', controller.getEvents);
  router.put('/:id', controller.updateEvent);
  router.delete('/:id', controller.deleteEvent);

  return router;
};