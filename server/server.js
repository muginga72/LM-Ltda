// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors    = require('cors');
const path    = require('path');

const authRoutes    = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Mount API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);

// Connect & start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, 
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server listening on port ${process.env.PORT}`)
  );
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});