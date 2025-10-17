const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceController');

// Async wrapper to catch errors and pass them to Express error handler
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(controller.listServices));
router.get('/:id', asyncHandler(controller.getService));
router.post('/', /* requireAdmin, */ asyncHandler(controller.createService)); // protect with auth in production
router.delete('/:id', /* requireAdmin, */ asyncHandler(controller.deleteService));

module.exports = router;