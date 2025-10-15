// models/ServiceSchedule.js
const mongoose = require('mongoose');

const ServiceScheduleSchema = new mongoose.Schema({
  serviceTitle: String,
  serviceType: String,
  fullName: String,
  date: String,
  time: String,
  email: String,
  paid: { type: Boolean, default: false },
  status: { type: String, enum: ["paid", "pending", "unpaid"], default: "unpaid" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model('ServiceSchedule', ServiceScheduleSchema);