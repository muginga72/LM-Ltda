// controllers/roomrental/bookingsController.js
const mongoose = require('mongoose');
const Booking = require('../../models/roomrental/Booking');
const Room = require('../../models/roomrental/Room');
const { toUTCDate } = require('../../utils/dateHelpers');
const fs = require('fs');
const path = require('path');

// Helper: check date overlap (A.start < B.end && A.end > B.start)
const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && aEnd > bStart;
};

const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().lean();
    res.json(rooms);
  } catch (err) {
    console.error('getRooms error:', err);
    next(err);
  }
};

const checkAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s) || isNaN(e) || s >= e) {
      return res.status(400).json({ message: 'Invalid date range' });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid room id' });
    }

    const room = await Room.findById(id).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // blockedDates that intersect requested range
    const blocked = (room.blockedDates || []).filter((b) => {
      const bFrom = new Date(b.from);
      const bTo = new Date(b.to);
      return rangesOverlap(s, e, bFrom, bTo);
    });

    // find bookings that overlap and are active (pending not expired or confirmed)
    const now = new Date();
    const overlappingBookings = await Booking.find({
      room: room._id,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { status: 'confirmed', $or: [{ startDate: { $lt: e, $gte: s } }, { endDate: { $gt: s, $lte: e } }, { startDate: { $lte: s }, endDate: { $gte: e } }] },
        { status: 'pending', expiresAt: { $gt: now }, $or: [{ startDate: { $lt: e, $gte: s } }, { endDate: { $gt: s, $lte: e } }, { startDate: { $lte: s }, endDate: { $gte: e } }] },
      ],
    }).lean();

    const available = blocked.length === 0 && overlappingBookings.length === 0;

    res.json({ available, blocked, overlappingBookings });
  } catch (err) {
    console.error('checkAvailability error:', err);
    next(err);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { roomId, startDate, endDate, guestsCount, dateOfBirth } = req.body;

    // ID document required
    if (!req.file) {
      return res.status(400).json({ message: 'Government ID / passport upload (idDocument) is required' });
    }

    // dateOfBirth required and valid
    if (!dateOfBirth) {
      return res.status(400).json({ message: 'dateOfBirth is required' });
    }
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ message: 'Invalid dateOfBirth' });
    }

    // Age check: must be at least 18
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    if (age < 18) {
      return res.status(400).json({ message: 'Guest must be at least 18 years old to book' });
    }

    // Validate roomId
    if (!roomId || !mongoose.isValidObjectId(roomId)) {
      return res.status(400).json({ message: 'Invalid roomId' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ message: 'Invalid startDate or endDate' });
    }

    // Nights and min/max checks
    const msPerDay = 24 * 60 * 60 * 1000;
    const nights = Math.ceil((end - start) / msPerDay);
    if (nights < (room.minNights || 1) || nights > (room.maxNights || 365)) {
      return res.status(400).json({ message: `Night count outside allowed range (${room.minNights || 1}-${room.maxNights || 365})` });
    }

    // Check blockedDates
    const isBlocked = (room.blockedDates || []).some((b) => {
      const bFrom = new Date(b.from);
      const bTo = new Date(b.to);
      return rangesOverlap(start, end, bFrom, bTo);
    });
    if (isBlocked) {
      return res.status(409).json({ message: 'Room is blocked for those dates' });
    }

    // Check overlapping bookings (confirmed OR pending and not expired)
    const now = new Date();
    const overlapping = await Booking.findOne({
      room: room._id,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
      $or: [
        { status: 'confirmed' },
        { status: 'pending', expiresAt: { $gt: now } },
      ],
    });

    // If there is an overlapping booking and room is not instantBook, reject
    if (overlapping && !room.instantBook) {
      return res.status(409).json({ message: 'Dates unavailable' });
    }

    // Compute price
    const pricePerNight = room.pricePerNight?.amount || 0;
    const totalAmount = nights * pricePerNight;

    // Save idDocument metadata
    const docMeta = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date(),
      storageProvider: 'local',
    };

    // Determine status and expiresAt
    const isInstant = !!room.instantBook;
    const status = isInstant ? 'confirmed' : 'pending';
    const expiresAt = isInstant ? null : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h hold

    // Create booking
    const booking = await Booking.create({
      room: room._id,
      guest: req.user._id,
      host: room.host,
      startDate: toUTCDate(start),
      endDate: toUTCDate(end),
      nights,
      guestsCount: guestsCount ? Number(guestsCount) : 1,
      totalPrice: { currency: room.pricePerNight?.currency || 'USD', amount: totalAmount },
      status,
      expiresAt,
      dateOfBirth: dob,
      idDocument: docMeta,
    });

    // Payment instructions for pending bookings
    const paymentInstructions = {
      accountNumber: process.env.PAY_ACCOUNT || '1234567890',
      iban: process.env.PAY_IBAN || 'DE00 0000 0000 0000 0000 00',
      branch: process.env.PAY_BRANCH || 'Other Branch - use transfer to branch X',
      note: 'Include booking id in transfer reference. Payment must be received within 24 hours to confirm booking.',
    };

    // Response
    if (status === 'pending') {
      return res.status(201).json({ booking, paymentInstructions });
    } else {
      return res.status(201).json({ booking });
    }
  } catch (err) {
    console.error('createBooking error:', err);
    next(err);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId || !mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({ message: 'bookingId required and must be a valid id' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === 'confirmed') {
      return res.json({ message: 'Already confirmed', booking });
    }

    booking.status = 'confirmed';
    booking.paymentInfo = booking.paymentInfo || {};
    booking.paymentInfo.paidAt = req.body.paidAt ? new Date(req.body.paidAt) : new Date();
    await booking.save();

    res.json({ message: 'Booking confirmed', booking });
  } catch (err) {
    console.error('confirmPayment error:', err);
    next(err);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid booking id' });

    const booking = await Booking.findById(id)
      .populate('room')
      .populate('guest', 'name email')
      .populate('host', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const userId = req.user && (req.user._id || req.user.id);
    const isOwner = booking.guest && String(booking.guest._id || booking.guest) === String(userId);
    const isHost = booking.host && String(booking.host._id || booking.host) === String(userId);
    if (!isOwner && !isHost && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(booking);
  } catch (err) {
    console.error('getBooking error:', err);
    next(err);
  }
};

// Alias for backward compatibility
const getBookingById = getBooking;

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
    console.error('listBookings error:', err);
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid booking id' });

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
    console.error('cancelBooking error:', err);
    next(err);
  }
};

module.exports = {
  getRooms,
  checkAvailability,
  createBooking,
  confirmPayment,
  getBooking,
  getBookingById,
  listBookings,
  cancelBooking,
};