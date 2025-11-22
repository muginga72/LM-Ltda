const mongoose = require('mongoose');

const AvailabilityWindow = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  type: { type: String, enum: ['available','blocked'], default: 'available' },
  reason: { type: String }
});

AvailabilityWindow.index({ room: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Availability', AvailabilityWindow);