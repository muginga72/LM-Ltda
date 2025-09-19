// routes/shares.js
const express = require('express');
const router  = express.Router();
const ServiceShare = require('../models/ServiceShare');

// Create
router.post('/', async (req, res) => {
  const share = await ServiceShare.create(req.body);
  // optionally integrate nodemailer here to actually send the email
  res.json(share);
});

// Read all
router.get('/', async (req, res) => {
  const list = await ServiceShare.find().sort('-createdAt');
  res.json(list);
});

// Delete
router.delete('/:id', async (req, res) => {
  await ServiceShare.findByIdAndDelete(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;