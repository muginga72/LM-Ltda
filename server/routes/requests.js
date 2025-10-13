// routes/requests.js
const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');

/**
 * POST /api/requests
 * Create a new service request (no payment required).
 */
router.post('/', async (req, res) => {
  try {
    const { serviceTitle, fullName, userEmail, serviceType, details } = req.body;

    const request = await ServiceRequest.create({
      serviceTitle,
      fullName,
      userEmail,
      serviceType ,
      details,
      paid: false // default to unpaid; can be updated manually if needed
    });

    res.status(201).json(request);
  } catch (err) {
    console.error('POST /api/requests error:', err);
    res.status(500).json({ error: 'Failed to create service request.' });
  }
});

/**
 * GET /api/requests
 * List all service requests.
 */
router.get('/', async (req, res) => {
  try {
    const list = await ServiceRequest.find().sort('-createdAt');
    res.json(list);
  } catch (err) {
    console.error('GET /api/requests error:', err);
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
});

/**
 * GET /api/requests/:id
 * Fetch a single service request by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const reqDoc = await ServiceRequest.findById(req.params.id);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found.' });
    res.json(reqDoc);
  } catch (err) {
    console.error(`GET /api/requests/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Failed to fetch request.' });
  }
});

/**
 * PATCH /api/requests/:id
 * Update fields of an existing service request.
 */
router.patch('/:id', async (req, res) => {
  try {
    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Request not found.' });
    res.json(updated);
  } catch (err) {
    console.error(`PATCH /api/requests/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Failed to update request.' });
  }
});

/**
 * DELETE /api/requests/:id
 * Remove a service request by ID.
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ServiceRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Request not found.' });
    res.json({ deleted: true });
  } catch (err) {
    console.error(`DELETE /api/requests/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Failed to delete request.' });
  }
});

module.exports = router;