// models/ServiceSchedule.js
const mongoose = require('mongoose');

const ServiceScheduleSchema = new mongoose.Schema({
//   serviceTitle: { type: String, required: true },
//   fullName:     { type: String, required: true },
//   serviceType:  { type: String, required: true },
//   date:         { type: String, required: true },
//   time:         { type: String, required: true },
//   createdAt:    { type: Date, default: Date.now }
// });

  serviceTitle: String,
  serviceType: String,
  fullName: String,
  date: String,
  time: String,
  email: String,
  paid: { type: Boolean, default: false },
  status: { type: String, enum: ["paid", "pending", "unpaid"], default: "unpaid" },
}, { timestamps: true });

module.exports = mongoose.model('ServiceSchedule', ServiceScheduleSchema);