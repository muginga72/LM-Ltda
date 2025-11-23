const mongoose = require('mongoose');
const Booking = require('../../models/roomrental/Booking');
const Room = require('../../models/roomrental/Room');
const { toUTCDate } = require('../../utils/dateHelpers');

// Create a new booking
const createBooking = async (req, res, next) => {
  try {
    const { roomId, startDate, endDate, guestsCount, dateOfBirth } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Government ID / passport upload (idDocument) is required' });
    }

    if (!dateOfBirth) {
      return res.status(400).json({ message: 'dateOfBirth is required' });
    }

    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ message: 'Invalid dateOfBirth' });
    }

    // Age check: must be at least 18
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear() -
      (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    if (age < 18) {
      return res.status(400).json({ message: 'Guest must be at least 18 years old to book' });
    }

    if (!mongoose.isValidObjectId(roomId)) {
      return res.status(400).json({ message: 'Invalid roomId' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ message: 'Invalid startDate or endDate' });
    }

    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights < room.minNights || nights > room.maxNights) {
      return res.status(400).json({ message: 'Night count outside allowed range' });
    }

    const conflict = await Booking.findOne({
      room: room._id,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lt: end, $gte: start } },
        { endDate: { $gt: start, $lte: end } },
        { startDate: { $lte: start }, endDate: { $gte: end } }
      ]
    });

    if (conflict && !room.instantBook) {
      return res.status(409).json({ message: 'Dates unavailable' });
    }

    const total = (room.pricePerNight?.amount || 0) * nights;

    const docMeta = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date(),
      storageProvider: 'local',
      providerKey: undefined
    };

    const booking = await Booking.create({
      room: room._id,
      guest: req.user._id,
      host: room.host,
      startDate: toUTCDate(start),
      endDate: toUTCDate(end),
      nights,
      guestsCount: guestsCount || 1,
      totalPrice: { currency: room.pricePerNight?.currency || 'USD', amount: total },
      status: room.instantBook ? 'confirmed' : 'pending',
      dateOfBirth: dob,
      idDocument: docMeta
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

// Get a booking by ID (public route that requires auth in router)
const getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    const booking = await Booking.findById(id)
      .populate('room')
      .populate('guest', 'name email')
      .populate('host', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // authorize: only guest (owner) or host or admin can view
    const userId = req.user && (req.user._id || req.user.id);
    const isOwner = booking.guest && String(booking.guest._id || booking.guest) === String(userId);
    const isHost = booking.host && String(booking.host._id || booking.host) === String(userId);
    if (!isOwner && !isHost && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// Alias kept for backward compatibility (if used elsewhere)
const getBookingById = getBooking;

// List all bookings for the logged-in user (GET /my)
const listBookings = async (req, res, next) => {
  try {
    if (!req.user || !(req.user._id || req.user.id)) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }

    const userId = req.user._id || req.user.id;
    const bookings = await Booking.find({ guest: userId })
      .populate('room')
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// Cancel a booking
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const userId = req.user._id || req.user.id;
    if (String(booking.guest) !== String(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBooking,
  getBookingById,
  listBookings,
  cancelBooking
};