// // server/models/RoomListingRequest.js
// const mongoose = require("mongoose");

// const RoomListingRequestSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, trim: true, lowercase: true },
//     phone: { type: String, required: true, trim: true },
//     description: { type: String, required: true, trim: true },
//     ip: { type: String },
//     userAgent: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.models.RoomListingRequest || mongoose.model("RoomListingRequest", RoomListingRequestSchema);


const mongoose = require("mongoose");

const RoomListingRequestSchema = new mongoose.Schema(
  {
    roomTitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    roomCapacity: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    minNights: { type: Number, default: 1 },
    maxNights: { type: Number, default: 30 },
    instantBook: { type: Boolean, default: false },

    pricePerNight: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },

    roomLocation: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      region: { type: String, default: "" },
      country: { type: String, default: "" },
      coordinates: { type: [Number], default: [] },
    },

    amenities: { type: [String], default: [] },
    rules: { type: [String], default: [] },

    images: [
      {
        filename: String,
        originalname: String,
        mimetype: String,
        size: Number,
        url: String,
        path: String,
      },
    ],

    terms: { type: String, default: "1 month" },
    acknowledge: { type: Boolean, default: false },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },

    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.RoomListingRequest ||
  mongoose.model("RoomListingRequest", RoomListingRequestSchema);