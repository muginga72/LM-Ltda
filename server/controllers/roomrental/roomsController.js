// server/controllers/roomsController.js
const fs = require('fs');
const path = require('path');
const Room = require('../../models/roomrental/Room');

exports.listRooms = async (req, res) => {
  try {
    const { page = 1, limit = 20, archived } = req.query;
    const filter = {};
    if (archived !== undefined) filter.archived = archived === 'true';
    const rooms = await Room.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('host', 'name email');
    const total = await Room.countDocuments(filter);
    res.json({ data: rooms, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('host', 'name email');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const body = req.body.payload ? JSON.parse(req.body.payload) : req.body;

    const room = new Room({
      ...body,
      host: body.host || req.user._id,
      roomImages: []
    });

    if (req.files && req.files.length) {
      req.files.forEach(f => {
        room.roomImages.push({
          filename: f.filename,
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size,
          path: f.path
        });
      });
    }

    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const body = req.body.payload ? JSON.parse(req.body.payload) : req.body;
    Object.assign(room, body);

    if (req.files && req.files.length) {
      req.files.forEach(f => {
        room.roomImages.push({
          filename: f.filename,
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size,
          path: f.path
        });
      });
    }

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.roomImages.forEach(img => {
      try { fs.unlinkSync(path.resolve(img.path)); } catch (e) { /* ignore */ }
    });

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};