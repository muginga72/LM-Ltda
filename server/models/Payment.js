const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    payerName: String,
    payerEmail: { type: String, required: true },
    amountPaid: Number,
    submissionMethod: String,
    dateReceived: Date,
    referenceId: String,
    proofPath: String, // /uploads/...
    status: {
      type: String,
      enum: ['pending', 'confirmed_half', 'confirmed_full'],
      default: 'pending',
    },
    // Unique identifier for each payment
    paymentId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs without paymentId
    },
  },
  { timestamps: true }
);

// Pre-save hook with dynamic import
PaymentSchema.pre('save', async function (next) {
  if (!this.paymentId) {
    const { v4: uuidv4 } = await import('uuid');
    this.paymentId = uuidv4();
  }
  next();
});

// Always reuse existing model if it exists
module.exports =
  mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);