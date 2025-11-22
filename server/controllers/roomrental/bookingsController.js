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
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }]
    });

    if (conflict && !room.instantBook) {
      return res.status(409).json({ message: 'Dates unavailable' });
    }

    const total = room.pricePerNight.amount * nights;

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
      guest: req.user.id,
      host: room.host,
      startDate: toUTCDate(start),
      endDate: toUTCDate(end),
      nights,
      guestsCount: guestsCount || 1,
      totalPrice: { currency: room.pricePerNight.currency, amount: total },
      status: room.instantBook ? 'confirmed' : 'pending',
      dateOfBirth: dob,
      idDocument: docMeta
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

// Get a booking by ID
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('guest', 'name email')
      .populate('host', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// List all bookings for the logged-in user
const listBookings = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }

    const bookings = await Booking.find({ guest: req.user.id })
      .populate('room')
      .populate('host', 'name email');

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// Cancel a booking
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (String(booking.guest) !== String(req.user.id)) {
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
  listBookings,
  cancelBooking
};