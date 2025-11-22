const Room = require('../../models/roomrental/Room');
const Booking = require('../../models/roomrental/Booking');

const createRoom = async (req, res, next) => {
  try {
    const data = req.body;
    data.host = req.user.id;
    const room = await Room.create(data);
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('host', 'name email');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

const searchRooms = async (req, res, next) => {
  try {
    const { city, startDate, endDate, minPrice, maxPrice, amenities } = req.query;
    const filter = { archived: false };

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter['pricePerNight.amount'] = {};
      if (minPrice) filter['pricePerNight.amount'].$gte = Number(minPrice);
      if (maxPrice) filter['pricePerNight.amount'].$lte = Number(maxPrice);
    }
    if (amenities) filter.amenities = { $all: amenities.split(',') };

    let rooms = await Room.find(filter);

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const conflicts = await Booking.find({
        $or: [{ startDate: { $lt: e }, endDate: { $gt: s } }],
        status: { $in: ['pending', 'confirmed'] }
      }).distinct('room');
      rooms = rooms.filter(r => !conflicts.includes(String(r._id)));
    }

    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRoom,
  getRoom,
  searchRooms
};