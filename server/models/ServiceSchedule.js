// models/ServiceSchedule.js
const mongoose = require('mongoose');

const ServiceScheduleSchema = new mongoose.Schema({
  serviceType: String,
  fullName: String,
  email: String,
  date: { type: String, required: true },       // original string (YYYY-MM-DD)
  time: { type: String, default: '' },          // optional time string HH:mm
  scheduledAt: { type: Date },                  // normalized date for querying
  imagePath: { type: String, required: false, default: '' },
  paid: { type: Boolean, default: false },
  status: { type: String, default: "unpaid" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
}, { timestamps: true });

module.exports = mongoose.model('ServiceSchedule', ServiceScheduleSchema);