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