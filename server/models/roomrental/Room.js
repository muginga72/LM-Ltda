// const mongoose = require('mongoose');

// const FileMetaSchema = new mongoose.Schema({
//   filename: String,
//   originalName: String,
//   mimeType: String,
//   size: Number,
//   path: String,
//   uploadedAt: { type: Date, default: Date.now }
// }, { _id: false });

// const PriceSchema = new mongoose.Schema({
//   currency: { type: String, default: 'USD' },
//   amount: { type: Number, required: true, min: 0 }
// }, { _id: false });

// const LocationSchema = new mongoose.Schema({
//   address: { type: String },
//   city: { type: String },
//   region: { type: String },
//   country: { type: String },
//   coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
// }, { _id: false });

// const RoomSchema = new mongoose.Schema({
//   host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   roomTitle: { type: String, required: true },
//   roomDescription: { type: String },
//   roomCapacity: { type: Number, default: 1 },
//   bedrooms: { type: Number, default: 1 },
//   bathrooms: { type: Number, default: 1 },
//   amenities: [{ type: String }],
//   pricePerNight: { type: PriceSchema, required: true },
//   minNights: { type: Number, default: 1 },
//   maxNights: { type: Number, default: 30 },
//   roomImages: [FileMetaSchema],
//   roomLocation: { type: LocationSchema },
//   rules: [{ type: String }],
//   instantBook: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
//   archived: { type: Boolean, default: false }
// }, { timestamps: true });

// module.exports = mongoose.model('Room', RoomSchema);

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