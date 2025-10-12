// models/ServiceRequest.js
const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  serviceTitle: String,
  serviceType: String,
  fullName: String,
  details: String,
  email: String,
  paid: { type: Boolean, default: false },
  status: { type: String, enum: ["paid", "pending", "unpaid"], default: "unpaid" },
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);