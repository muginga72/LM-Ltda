const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    imagePath: { type: String, required: true },
    status: { type: String, enum: ["unpaid", "pending", "paid"], default: "unpaid" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);