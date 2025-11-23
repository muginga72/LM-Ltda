// routes/roomrental/rooms.js
const express = require('express');
const router = express.Router();
const { createRoom, getRoom, searchRooms } = require('../../controllers/roomrental/roomsController');

const { protect } = require('../../middleware/authMiddleware'); 

router.get('/', searchRooms);
router.post('/', protect, createRoom);
router.get('/:id', getRoom);

module.exports = router;