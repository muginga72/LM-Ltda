// controllers/roomrental/roomsController.js
const mongoose = require('mongoose');
const Room = require('../../models/roomrental/Room');
const Booking = require('../../models/roomrental/Booking');

/**
 * Create a room (requires auth middleware to set req.user)
 */
const createRoom = async (req, res, next) => {
  try {
    const data = { ...req.body };
    // prefer req.user._id but accept req.user.id
    data.host = req.user && (req.user._id || req.user.id);
    const room = await Room.create(data);
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single room by id with validation to avoid CastError
 */
const getRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid room id' });
    }

    const room = await Room.findById(id).populate('host', 'name email');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

/**
 * Search rooms with optional availability check
 * Query params:
 *  - city
 *  - startDate, endDate
 *  - minPrice, maxPrice
 *  - amenities (comma separated)
 *  - page, limit (optional pagination)
 */
const searchRooms = async (req, res, next) => {
  try {
    const {
      city,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      amenities,
      page = 1,
      limit = 50,
      archived = 'false'
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const perPage = Math.min(200, Number(limit) || Number(limit) === 0 ? 0 : 50);
    const skip = (pageNum - 1) * perPage;

    // Build filter using correct schema fields
    const filter = {};
    filter.archived = archived === 'true';

    if (city) {
      // case-insensitive partial match on roomLocation.city
      filter['roomLocation.city'] = new RegExp(city.trim(), 'i');
    }

    if (minPrice || maxPrice) {
      filter['pricePerNight.amount'] = {};
      if (minPrice) filter['pricePerNight.amount'].$gte = Number(minPrice);
      if (maxPrice) filter['pricePerNight.amount'].$lte = Number(maxPrice);
    }

    if (amenities) {
      const list = String(amenities).split(',').map(a => a.trim()).filter(Boolean);
      if (list.length) filter.amenities = { $all: list };
    }

    // initial rooms matching static filters
    let roomsQuery = Room.find(filter).sort({ createdAt: -1 });

    // apply pagination only if limit > 0
    if (perPage > 0) roomsQuery = roomsQuery.skip(skip).limit(perPage);

    let rooms = await roomsQuery.lean();

    // If checking availability, filter out rooms that have a conflicting booking
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (isNaN(s.getTime()) || isNaN(e.getTime()) || s >= e) {
        return res.status(400).json({ message: 'Invalid startDate or endDate' });
      }

      // find bookings that overlap the requested window
      // overlap condition: booking.start < e && booking.end > s
      const conflicts = await Booking.find({
        startDate: { $lt: e },
        endDate: { $gt: s },
        status: { $in: ['pending', 'confirmed'] }
      }).distinct('room');

      // Normalize conflicts to string array
      const conflictIds = conflicts.map(id => String(id));

      // filter local rooms array by removing those in conflictIds
      rooms = rooms.filter(r => !conflictIds.includes(String(r._id)));
    }

    // If we paginated earlier via mongoose, the meta info needs count separately.
    // Provide total count for the unpaginated filter (without availability) for client convenience.
    const totalCount = await Room.countDocuments(filter);

    res.json({
      data: rooms,
      meta: {
        page: pageNum,
        limit: perPage,
        totalMatching: totalCount
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRoom,
  getRoom,
  searchRooms
};