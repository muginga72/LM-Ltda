// models/ServiceRequest.js
const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  serviceTitle: String,
  serviceType: String,
  fullName: String,
  details: String,
  email: String,
  imagePath: { type: String, required: false, default: '' },
  paid: { type: Boolean, default: false },
  status: { type: String, enum: ["paid", "pending", "unpaid"], default: "unpaid" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);