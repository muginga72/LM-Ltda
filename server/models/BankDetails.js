const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema({
  bankName: String,
  accountName: String,
  accountNumber: String,
  swiftCode: String,
  supportEmail: String,
});

module.exports = mongoose.model("BankDetails", bankDetailsSchema);