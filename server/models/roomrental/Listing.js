const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountHolder: { type: String, required: true },
  ibanOrAccount: { type: String, required: true }, // store encrypted if required
}, { _id: false });

const ListingSchema = new mongoose.Schema({
  host: {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: { type: String },
  },
  property: {
    title: { type: String, required: true },
    description: { type: String },
    nightlyPrice: { type: Number, required: true, min: 0 },
  },
  fees: {
    listingFeeAccepted: { type: Boolean, required: true },
    commissionPercent: { type: Number, required: true, default: 7.5 },
  },
  payout: {
    method: { type: String, enum: ["LM-Ltda", "Host-managed"], required: true },
    bank: { type: BankSchema, default: null },
  },
  createdAt: { type: Date, default: Date.now },
  meta: { type: Object, default: {} }
});

module.exports = mongoose.model("Listing", ListingSchema);