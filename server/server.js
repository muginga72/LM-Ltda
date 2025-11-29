// server/server.js
require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requests');
const scheduleRoutes = require('./routes/schedules');
const shareRoutes = require('./routes/shares');
const testimonialsRoute = require('./routes/testimonials');
const cardsRoutes = require('./routes/cardsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadFilesRoutes = require('./routes/uploadFilesRoutes');
const paymentsRouter = require('./routes/payments/payments');
const calendarRouter = require('./routes/calendar');
const contactRouter = require('./routes/contact');
const adminCalendarRouterFactory = require('./routes/adminCalendar');
const calendarAvailabilityRouter = require('./routes/calendarAvailability');
const roomsRoutes = require('./routes/roomrental/roomRoutes');
const bookingRoutes = require('./routes/roomrental/bookingRoutes');
const listingsRouter = require('./routes/roomrental/listingRoutes');
const uploadsRouter = require('./routes/uploads/uploads');
const roomRequestRoutes = require('./routes/roomrental/roomRequestRoutes');

const { Server } = require('socket.io');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Basic protection + logging
app.use(helmet());
app.use(morgan('dev'));

// CORS for frontend dev
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

// ---------- Ensure uploads dir exists and is exposed ----------
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  console.warn(`uploads directory not found, creating at ${UPLOADS_DIR}`);
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Allow cross-origin image use in dev
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN || 'http://localhost:3000');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Serve uploads as static files
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    index: false,
    maxAge: '1d',
  })
);

// Mount the uploads router at /api/uploads
app.use('/api/uploads', uploadsRouter);

// Optionally also serve common images assets
app.use('/api/images', express.static(path.join(__dirname, 'assets', 'images')));

// ---------- Mount other API routes ----------
app.use('/api', uploadFilesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/shares', shareRoutes);
app.use('/api/contact', contactRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/calendar', calendarAvailabilityRouter);
app.use('/api/testimonials', testimonialsRoute);

// Room rental routes (roomRoutes should use multer configured to accept 'images')
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/listings', listingsRouter);
app.use('/api/room-requests', roomRequestRoutes);

// mount admin calendar routes with io
app.use('/api/admin/calendar', adminCalendarRouterFactory(io));

// No-store on API responses if you prefer
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// 404 fallback
app.use((req, res, next) => {
  res.status(404).send(`Not found: ${req.originalUrl}`);
});

// Multer-aware error handler and generic error handler
app.use((err, req, res, next) => {
  // Multer errors (e.g., Unexpected field, file too large)
  if (err && err.name === 'MulterError') {
    // Map common Multer codes to 400
    const status = 400;
    return res.status(status).json({
      error: err.code || 'MULTER_ERROR',
      message: err.message || 'File upload error',
    });
  }

  // Other errors
  console.error('Unhandled error:', err);
  res.status(err?.status || 500).json({ error: err?.message || 'Internal Server Error' });
});

// Start DB + server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server + Socket.IO listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });