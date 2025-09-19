// models/ServiceRequest.js
const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  serviceTitle: { type: String, required: true },
  fullName:     { type: String, required: true },
  serviceType:  { type: String, required: true },
  details:      { type: String, required: true },
  paid:         { type: Boolean, default: false },
  stripeSessionId:{ type: String },
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);