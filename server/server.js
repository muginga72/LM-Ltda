// Import middleware
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors    = require('cors');
const path    = require('path');

// Import routes
const authRoutes    = require('./routes/authRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes  = require('./routes/requests');
const scheduleRoutes = require('./routes/schedules');
const shareRoutes    = require('./routes/shares');
const testimonialsRoute = require("./routes/testimonials");
const cardsRoutes = require('./routes/cardsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadFilesRoutes');
const paymentsRoutes = require('./routes/payments/paymentsRoutes');
const proofPaymentRoutes = require('./routes/payments/proofPaymentRoutes');
const adminPaymentsRoutes = require("./routes/payments/adminPaymentsRoutes");

// Instantiate the Express application
const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Stripe webhook must get raw body
app.use('/api/requests/webhook', requestRoutes);
app.use("/uploads", express.static("uploads"));

// Mount API (lightblue API name check the router)
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/users', userRoutes);
app.use("/api", uploadRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/requests',  requestRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/shares',    shareRoutes);
app.use("/api/testimonials", testimonialsRoute);
app.use("/api", paymentsRoutes);
app.use("/api/payments", proofPaymentRoutes);
app.use("/api/admin-payments", adminPaymentsRoutes);

// Connect & start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, 
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server listening on port ${process.env.PORT}`)
  );
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});