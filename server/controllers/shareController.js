const ServiceShare = require('../models/ServiceShare');

// Create a new service share
exports.createServiceShare = async (req, res) => {
  try {
    const { serviceType, fullName, serviceTitle, email, notes } = req.body;

    if (!fullName || !serviceTitle || !email) {
      return res.status(400).json({ error: 'fullName, serviceTitle, and email are required.' });
    }

    const newShare = new ServiceShare({ serviceType, fullName, serviceTitle, email, notes });
    const savedShare = await newShare.save();
    res.status(201).json(savedShare);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service share', details: err.message });
  }
};

// Get all service shares
exports.getAllServiceShares = async (req, res) => {
  try {
    const shares = await ServiceShare.find().sort({ createdAt: -1 });
    res.status(200).json(shares);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service shares', details: err.message });
  }
};

// Get a single service share by ID
exports.getServiceShareById = async (req, res) => {
  try {
    const share = await ServiceShare.findById(req.params.id);
    if (!share) return res.status(404).json({ error: 'Service share not found' });
    res.status(200).json(share);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service share', details: err.message });
  }
};

// Update a service share
exports.updateServiceShare = async (req, res) => {
  try {
    const updatedShare = await ServiceShare.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedShare) return res.status(404).json({ error: 'Service share not found' });
    res.status(200).json(updatedShare);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service share', details: err.message });
  }
};

// Delete a service share
exports.deleteServiceShare = async (req, res) => {
  try {
    const deletedShare = await ServiceShare.findByIdAndDelete(req.params.id);
    if (!deletedShare) return res.status(404).json({ error: 'Service share not found' });
    res.status(200).json({ message: 'Service share deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service share', details: err.message });
  }
};