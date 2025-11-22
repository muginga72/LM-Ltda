const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  storageProvider: { type: String, default: 'local' },
  providerKey: { type: String } // optional provider identifier if using S3 etc
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  nights: { type: Number, required: true },
  guestsCount: { type: Number, default: 1 },
  totalPrice: {
    currency: { type: String, default: 'USD' },
    amount: { type: Number, required: true, min: 0 }
  },
  status: { type: String, enum: ['pending','confirmed','cancelled','completed','rejected'], default: 'pending' },

  // New fields
  dateOfBirth: { type: Date, required: true },
  idDocument: { type: DocumentSchema, required: true },

  createdAt: { type: Date, default: Date.now }
});

BookingSchema.index({ room: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Booking', BookingSchema);