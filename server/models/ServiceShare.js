// models/ServiceShare.js
const mongoose = require('mongoose');

const ServiceShareSchema = new mongoose.Schema({
  serviceTitle: { type: String, required: true },
  email:        { type: String, required: true },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceShare', ServiceShareSchema);