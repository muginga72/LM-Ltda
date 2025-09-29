// Import middleware
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors    = require('cors');
const path    = require('path');

// Import routes
const authRoutes    = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes  = require('./routes/requests');
const scheduleRoutes = require('./routes/schedules');
const shareRoutes    = require('./routes/shares');
const testimonialsRoute = require("./routes/testimonials");
const cardsRoutes = require('./routes/cardsRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Instantiate the Express application
const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());

// Stripe webhook must get raw body
app.use('/api/requests/webhook', requestRoutes);

// Mount API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests',  requestRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/shares',    shareRoutes);
app.use("/api/testimonials", testimonialsRoute);
app.use("/api/user", userRoutes);

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