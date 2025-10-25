const path = require('path');
const fs = require('fs');
const ServiceRequest = require('../models/ServiceRequest');

// Directory for uploaded images
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Helper to safely delete an image file
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
  // Create a new service request
  createRequest: async (req, res) => {
    try {
      const {
        serviceId,
        serviceTitle,
        fullName,
        email,
        phone,
        serviceType,
        details,
        date,
        user,
      } = req.body;

      if (!serviceId || !fullName || !email) {
        return res.status(400).json({ error: 'serviceId, fullName and email are required' });
      }

      // If your schema requires imagePath, provide a placeholder path when no file is uploaded.
      // Ensure a placeholder exists at uploads/default.png if using this value.
      const imagePath = req.file
        ? `/api/requests/uploads/${req.file.filename}`
        : '/api/requests/uploadefault.png';

      const newRequest = new ServiceRequest({
        serviceId,
        serviceTitle: serviceTitle || '',
        fullName,
        email,
        phone: phone || '',
        serviceType: serviceType || '',
        details: details || '',
        date: date ? new Date(date) : undefined,
        imagePath,
        paid: false,
        user,
      });

      const saved = await newRequest.save();
      return res.status(201).json({ ok: true, request: saved });
    } catch (err) {
      console.error('createRequest error:', err);
      if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message || err.errors[key].kind || true;
          return acc;
        }, {});
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // List all service requests
  listRequests: async (req, res) => {
    try {
      const list = await ServiceRequest.find().sort('-createdAt');
      return res.json(list);
    } catch (err) {
      console.error('listRequests error:', err);
      return res.status(500).json({ error: 'Failed to fetch requests.' });
    }
  },

  // Get a single request by ID
  getRequestById: async (req, res) => {
    try {
      const request = await ServiceRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ error: 'Request not found.' });
      return res.json(request);
    } catch (err) {
      console.error(`getRequestById ${req.params.id} error:`, err);
      return res.status(500).json({ error: 'Failed to fetch request.' });
    }
  },

  // Update request fields
  updateRequest: async (req, res) => {
    try {
      const updated = await ServiceRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Request not found.' });
      return res.json(updated);
    } catch (err) {
      console.error(`updateRequest ${req.params.id} error:`, err);
      if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message || err.errors[key].kind || true;
          return acc;
        }, {});
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      return res.status(500).json({ error: 'Failed to update request.' });
    }
  },

  // Delete a request and its image
  deleteRequest: async (req, res) => {
    try {
      const deleted = await ServiceRequest.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Request not found.' });

      // remove uploaded file if it's not the placeholder
      if (deleted.imagePath && !deleted.imagePath.includes('default.png')) {
        deleteImageFile(deleted.imagePath);
      }

      return res.json({ deleted: true });
    } catch (err) {
      console.error(`deleteRequest ${req.params.id} error:`, err);
      return res.status(500).json({ error: 'Failed to delete request.' });
    }
  },

  // Replace or add image to existing request
  uploadRequestImage: async (req, res) => {
    try {
      const request = await ServiceRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ error: 'Request not found.' });

      // remove previous image file if it's not the default placeholder
      if (request.imagePath && !request.imagePath.includes('default.png')) {
        deleteImageFile(request.imagePath);
      }

      const newImagePath = req.file
        ? `/api/requests/uploads/${req.file.filename}`
        : '/images/default.png';

      request.imagePath = newImagePath;
      const saved = await request.save();

      return res.json({ ok: true, request: saved });
    } catch (err) {
      console.error(`uploadRequestImage ${req.params.id} error:`, err);
      if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message || err.errors[key].kind || true;
          return acc;
        }, {});
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      return res.status(500).json({ error: 'Failed to upload image.' });
    }
  },
};