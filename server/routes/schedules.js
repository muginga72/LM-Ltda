// routes/schedules.js
const express = require('express');
const router  = express.Router();
const ServiceSchedule = require('../models/ServiceSchedule');

// Create
router.post('/', async (req, res) => {
  const sched = await ServiceSchedule.create(req.body);
  res.json(sched);
});

// Read all
router.get('/', async (req, res) => {
  const list = await ServiceSchedule.find().sort('-createdAt');
  res.json(list);
});

// Read one
router.get('/:id', async (req, res) => {
  const doc = await ServiceSchedule.findById(req.params.id);
  res.json(doc);
});

// Update
router.patch('/:id', async (req, res) => {
  const updated = await ServiceSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete
router.delete('/:id', async (req, res) => {
  await ServiceSchedule.findByIdAndDelete(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;