// controllers/roomrental/roomController.js
const Room = require('../../models/roomrental/Room'); // adjust if your model path differs
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    res.json(rooms);
  } catch (err) {
    console.error('getRooms error:', err);
    res.status(500).json({ message: 'Failed to fetch rooms.' });
  }
};

const createRoom = async (req, res) => {
  try {
    const { title, description, price, capacity } = req.body || {};
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const images = (req.files || []).map(f => path.relative(process.cwd(), f.path));

    const room = new Room({
      title,
      description,
      price: price ? Number(price) : undefined,
      capacity: capacity ? Number(capacity) : undefined,
      images
    });

    await room.save();
    res.status(201).json({ message: 'Room created', room });
  } catch (err) {
    console.error('createRoom error:', err);
    res.status(500).json({ message: 'Failed to create room.' });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const { title, description, price, capacity, removeImages } = req.body || {};

    if (title !== undefined) room.title = title;
    if (description !== undefined) room.description = description;
    if (price !== undefined) room.price = Number(price);
    if (capacity !== undefined) room.capacity = Number(capacity);

    if (req.files && req.files.length) {
      const newImages = req.files.map(f => path.relative(process.cwd(), f.path));
      room.images = (room.images || []).concat(newImages);
    }

    if (removeImages) {
      const toRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      room.images = (room.images || []).filter(img => !toRemove.includes(img));
      toRemove.forEach(imgRel => {
        try {
          const full = path.resolve(process.cwd(), imgRel);
          if (fs.existsSync(full)) fs.unlinkSync(full);
        } catch (e) {
          console.warn('Failed to delete image file', imgRel, e);
        }
      });
    }

    await room.save();
    res.json({ message: 'Room updated', room });
  } catch (err) {
    console.error('updateRoom error:', err);
    res.status(500).json({ message: 'Failed to update room.' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    (room.images || []).forEach(imgRel => {
      try {
        const full = path.resolve(process.cwd(), imgRel);
        if (fs.existsSync(full)) fs.unlinkSync(full);
      } catch (e) {
        console.warn('Failed to delete image file', imgRel, e);
      }
    });

    await room.remove();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    console.error('deleteRoom error:', err);
    res.status(500).json({ message: 'Failed to delete room.' });
  }
};

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };