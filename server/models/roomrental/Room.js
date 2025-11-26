const mongoose = require('mongoose');

const FileMetaSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  path: String,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const RoomSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomTitle: { type: String, required: true },
  roomDescription: String,
  pricePerNight: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  roomImages: [FileMetaSchema],
  roomLocation: {
    address: String,
    city: String,
    region: String,
    country: String,
    coordinates: [Number]
  },
  roomCapacity: { type: Number, default: 1 },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  amenities: [String],
  rules: [String],
  minNights: { type: Number, default: 1 },
  maxNights: { type: Number, default: 30 },
  instantBook: { type: Boolean, default: false },
  archived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);