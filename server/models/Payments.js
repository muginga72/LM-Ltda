// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   paymentId: { type: String, required: true, unique: true },
//   orderId: { type: String, required: true },
//   userId: { type: String, required: true },
//   amount: { type: Number, required: true },
//   currency: { type: String, default: "USD" },
//   status: {
//     type: String,
//     enum: ["pending_payment", "under_review", "confirmed", "rejected"],
//     default: "pending_payment",
//   },
//   referenceCode: { type: String },
//   proofFileUrl: { type: String },
//   adminNotes: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Payment", paymentSchema);

const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  serviceId: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileName: String,
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);