// server/routes/calendarAvailability.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/calendarAvailabilityController');

router.get('/availability', controller.getAvailability);

module.exports = router;