// server/models/roomrental/ListingContract.js
const mongoose = require("mongoose");

const ListingContractSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  acknowledgedByName: { type: String, required: true },
  acknowledgedAt: { type: Date, required: true },
  ip: { type: String },
  userAgent: { type: String },
  meta: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model("ListingContract", ListingContractSchema);
