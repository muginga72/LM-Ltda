const express = require('express');
const router = express.Router();
const {
  createRoom,
  getRoom,
  searchRooms
} = require('../../controllers/roomrental/roomsController');

// Create a new room
router.post('/', createRoom);

// Get a specific room by ID
router.get('/:id', getRoom);

// Search available rooms
router.get('/', searchRooms);

module.exports = router;
