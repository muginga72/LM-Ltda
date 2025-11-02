// server/models/Event.js

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // DATEONLY style; keep as string "YYYY-MM-DD"
  time: { type: String, required: true }, // "HH:mm"
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  createdByAdmin: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'events'
});

module.exports = mongoose.model('Event', EventSchema);