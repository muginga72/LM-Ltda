// models/roomrental/Booking.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    storageProvider: { type: String, default: 'local' },
    providerKey: { type: String }, 
  },
  { _id: false }
);

const PriceSchema = new mongoose.Schema(
  {
    currency: { type: String, default: 'USD' },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    nights: { type: Number, required: true, min: 1 },

    guestsCount: { type: Number, default: 1, min: 1 },

    totalPrice: { type: PriceSchema, required: true },

    // Guest personal info (optional)
    guestOneName: { type: String },
    guestOneEmail: { type: String },
    guestTwoName: { type: String },
    guestTwoEmail: { type: String },
    guestOnePhone: { type: String },
    dateOfBirth: { type: Date },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
      default: 'pending',
    },

    // Optional personal info (make optional so booking can be created before upload)
    dateOfBirth: { type: Date },

    idDocument: { type: DocumentSchema },

    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        // default expiresAt 2 days from now
        return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      },
    },

    paymentInfo: {
      method: {
        type: String,
        enum: ['bank_transfer', 'deposit'],
        default: 'bank_transfer',
      },
      accountNumber: { type: String },
      iban: { type: String },
      branch: { type: String },
      paidAt: { type: Date },
      notes: { type: String },
    },

    notes: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ room: 1, startDate: 1, endDate: 1 });

BookingSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    return next(new Error('endDate must be after startDate'));
  }

  // Compute nights if not provided or invalid
  if ((!this.nights || this.nights < 1) && this.startDate && this.endDate) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((this.endDate - this.startDate) / msPerDay);
    this.nights = diffDays > 0 ? diffDays : 1;
  }

  next();
});

// Optional: ensure totalPrice.amount exists and is non-negative
BookingSchema.pre('validate', function (next) {
  if (!this.totalPrice || typeof this.totalPrice.amount !== 'number') {
    return next(new Error('totalPrice.amount is required and must be a number'));
  }
  if (this.totalPrice.amount < 0) {
    return next(new Error('totalPrice.amount must be >= 0'));
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);