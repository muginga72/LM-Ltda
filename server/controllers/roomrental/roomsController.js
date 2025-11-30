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
    const parse = (val, fallback) => {
      try {
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch {
        return fallback;
      }
    };

    const roomTitle = req.body.roomTitle || req.body.title;
    if (!roomTitle) return res.status(400).json({ message: "roomTitle is required" });

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: missing user" });
    }

    const images = (req.files || []).map((file) => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      url: `/uploads/rooms/${file.filename}`,
      path: file.path,
    }));

    const room = new Room({
      roomTitle,
      roomDescription: req.body.roomDescription || "",
      roomCapacity: Number(req.body.roomCapacity) || 1,
      bedrooms: Number(req.body.bedrooms) || 1,
      bathrooms: Number(req.body.bathrooms) || 1,
      minNights: Number(req.body.minNights) || 1,
      maxNights: Number(req.body.maxNights) || 30,
      instantBook: req.body.instantBook === "true",
      archived: false,
      pricePerNight: parse(req.body.pricePerNight, { amount: 100, currency: "USD" }),
      roomLocation: parse(req.body.roomLocation, {
        address: "",
        city: "",
        region: "",
        country: "",
        coordinates: [],
      }),
      amenities: parse(req.body.amenities, []),
      rules: parse(req.body.rules, []),
      images,
      host: req.user._id,
    });

    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error("createRoom error:", err);
    res.status(500).json({ message: "Room creation failed", error: err.message });
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