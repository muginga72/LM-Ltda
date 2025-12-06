// models/roomrental/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomTitle: { type: String, required: true },
    roomDescription: { type: String, default: "" },
    roomCapacity: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    minNights: { type: Number, default: 1 },
    maxNights: { type: Number, default: 30 },
    instantBook: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },

    pricePerNight: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },

    roomLocation: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      region: { type: String, default: "" },
      country: { type: String, default: "" },
      coordinates: {
        type: [Number],
        default: [],
      },
    },

    amenities: { type: [String], default: [] },
    rules: { type: [String], default: [] },

    images: [
      {
        filename: String,
        mimetype: String,
        url: String,
        path: String,
      },
    ],

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedDates: [
      {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
        reason: { type: String, default: "" },
      },
    ],
  }, { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);