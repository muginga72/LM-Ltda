const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  status: {
    type: String,
    enum: ["pending_payment", "under_review", "confirmed", "rejected"],
    default: "pending_payment",
  },
  referenceCode: { type: String },
  proofFileUrl: { type: String },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);