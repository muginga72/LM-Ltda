const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  provider: { type: String }, // stripe, paypal, etc.
  providerPaymentId: { type: String },
  status: { type: String, enum: ['pending','succeeded','failed','refunded'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoomPayment', PaymentSchema);