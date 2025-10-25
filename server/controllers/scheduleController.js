const path = require('path');
const fs = require('fs');
const ServiceSchedule = require('../models/ServiceSchedule');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const deleteImageFile = (imagePath) => {
  if (!imagePath) return;
  const filename = imagePath.split('/').pop();
  if (!filename) return;
  const filePath = path.join(uploadsDir, filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error deleting image file:', err);
    }
  });
};

module.exports = {
  createSchedule: async (req, res) => {
    try {
      const {
        serviceTitle,
        serviceType,
        fullName,
        date,
        time,
        email,
        paid,
        status,
        user,
      } = req.body;

      if (!fullName || !email || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // If your schema requires imagePath, supply a real placeholder path when file not provided.
      // Ensure a placeholder exists at uploads/default.png or change this default to your preferred path.
      const imagePath = req.file
        ? `/api/schedules/uploads/${req.file.filename}`
        : '/api/schedules/uploads/default.png';

      const sched = new ServiceSchedule({
        serviceTitle,
        serviceType,
        fullName,
        date,
        time,
        email,
        imagePath,
        paid: !!paid,
        status: status || 'unpaid',
        user,
      });

      const saved = await sched.save();
      res.status(201).json({ ok: true, schedule: saved });
    } catch (err) {
      console.error('createSchedule error:', err);
      if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message || err.errors[key].kind || true;
          return acc;
        }, {});
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  listSchedules: async (req, res) => {
    try {
      const list = await ServiceSchedule.find().sort('-createdAt');
      res.json(list);
    } catch (err) {
      console.error('listSchedules error:', err);
      res.status(500).json({ error: 'Failed to fetch schedules' });
    }
  },

  getScheduleById: async (req, res) => {
    try {
      const doc = await ServiceSchedule.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Schedule not found' });
      res.json(doc);
    } catch (err) {
      console.error(`getScheduleById ${req.params.id} error:`, err);
      res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const updated = await ServiceSchedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Schedule not found' });
      res.json(updated);
    } catch (err) {
      console.error(`updateSchedule ${req.params.id} error:`, err);
      if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message || err.errors[key].kind || true;
          return acc;
        }, {});
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  },

  deleteSchedule: async (req, res) => {
    try {
      const deleted = await ServiceSchedule.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Schedule not found' });

      deleteImageFile(deleted.imagePath);
      res.json({ deleted: true });
    } catch (err) {
      console.error(`deleteSchedule ${req.params.id} error:`, err);
      res.status(500).json({ error: 'Failed to delete schedule' });
    }
  },

  uploadScheduleImage: async (req, res) => {
    try {
      const doc = await ServiceSchedule.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Schedule not found' });

      // remove previous image file if it's not the default placeholder
      if (doc.imagePath && !doc.imagePath.includes('default.png')) {
        deleteImageFile(doc.imagePath);
      }

      const newImagePath = req.file
        ? `/api/schedules/uploads/${req.file.filename}`
        : 'images/default.png';

      doc.imagePath = newImagePath;
      await doc.save();

      res.json({ ok: true, schedule: doc });
    } catch (err) {
      console.error(`uploadScheduleImage ${req.params.id} error:`, err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  },
};