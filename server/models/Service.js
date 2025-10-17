// models/Service.js
const mongoose = require("mongoose"); 

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, default: 0 }, // remove required if you want default
  imagePath: { type: String, required: true }, // 👈 match frontend/controller
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);