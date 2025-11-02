// // Import middleware
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors    = require('cors');
// const path    = require('path');

// // Import routes
// const authRoutes    = require('./routes/authRoutes');
// const servicesRoutes = require('./routes/servicesRoutes');
// const userRoutes = require('./routes/userRoutes');
// const requestRoutes  = require('./routes/requests');
// const scheduleRoutes = require('./routes/schedules');
// const shareRoutes    = require('./routes/shares');
// const testimonialsRoute = require("./routes/testimonials");
// const cardsRoutes = require('./routes/cardsRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const uploadRoutes = require('./routes/uploadFilesRoutes');
// const paymentsRouter = require("./routes/payments/payments"); // adjust path as needed
// // const paymentConfRoute = require("./routes/payments/payments"); 

// // Instantiate the Express application
// const app = express();

// // Middlewares
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));

// // Stripe webhook must get raw body
// app.use('/api/requests/webhook', requestRoutes);
// // app.use("/uploads", express.static("uploads"));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/requests/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/schedules/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/images', express.static(path.join(__dirname, 'assets', 'images')));

// // Mount API (lightblue API name check the router)
// app.use('/api/admin', adminRoutes);
// app.use('/api/auth', authRoutes);
// app.use("/api/user", userRoutes);
// app.use('/api/users', userRoutes);
// app.use("/api", uploadRoutes);
// app.use('/api/cards', cardsRoutes);
// app.use('/api/services', servicesRoutes);
// app.use('/api/requests',  requestRoutes);
// app.use('/api/schedules', scheduleRoutes);
// app.use('/api/shares',    shareRoutes);
// app.use("/api/payments", paymentsRouter);
// // app.use('/api/payments', paymentConfRoute);
// app.use("/api/testimonials", testimonialsRoute);


// // --- before other body parsing middleware ---
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors    = require('cors');
// const path    = require('path');

// const authRoutes    = require('./routes/authRoutes');
// const servicesRoutes = require('./routes/servicesRoutes');
// const userRoutes = require('./routes/userRoutes');
// const requestRoutes  = require('./routes/requests'); 
// const scheduleRoutes = require('./routes/schedules');
// const shareRoutes    = require('./routes/shares');
// const testimonialsRoute = require("./routes/testimonials");
// const cardsRoutes = require('./routes/cardsRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const uploadRoutes = require('./routes/uploadFilesRoutes');
// const paymentsRouter = require("./routes/payments/payments");

// const app = express();

// // CORS and JSON parsing for normal routes
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// app.use(express.json());           // parse JSON for normal endpoints
// const http = require("http").createServer(app);
// const { Server } = require("socket.io");
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));

// const io = new Server(http, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "DELETE"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);
// });

// // attach calendar router with io
// const adminCalendarRouter = require('./routes/adminCalendar')(io);

// // Serve static folders
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/requests/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/schedules/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/images', express.static(path.join(__dirname, 'assets', 'images')));

// // --- WEBHOOK: use raw body (only if you need raw body for signature verification like Stripe) ---
// // Put this before any JSON body parser for the specific webhook route
// app.post(
//   '/api/requests/webhook',
//   express.raw({ type: 'application/json' }),
//   (req, res, next) => {
//     next();
//   }
// );

// // --- Mount routers (single mount for users) ---
// app.use('/api/admin', adminRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);   // use one consistent path
// // remove the duplicate: app.use("/api/user", userRoutes);

// // requests router (regular JSON-handled endpoints)
// app.use('/api/requests', requestRoutes);

// app.use('/api/cards', cardsRoutes);
// app.use('/api/services', servicesRoutes);
// app.use('/api/schedules', scheduleRoutes);
// app.use('/api/shares', shareRoutes);
// app.use('/api/payments', paymentsRouter);
// app.use('/api/testimonials', testimonialsRoute);
// app.use('/api/calendar', adminCalendarRouter);
// app.use('/api', uploadRoutes);

// // Connect & start
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true, 
// })
// .then(() => {
//   console.log('✅ MongoDB connected');
//   app.listen(process.env.PORT, () =>
//     console.log(`🚀 Server listening on port ${process.env.PORT}`)
//   );
// })
// .catch(err => {
//   console.error('MongoDB connection error:', err);
// });


// server/server.js
require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requests');
const scheduleRoutes = require('./routes/schedules');
const shareRoutes = require('./routes/shares');
const testimonialsRoute = require('./routes/testimonials');
const cardsRoutes = require('./routes/cardsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadFilesRoutes');
const paymentsRouter = require('./routes/payments/payments');
const calendarRouter = require('./routes/calendar');
const adminCalendarRouterFactory = require('./routes/adminCalendar');
const calendarAvailabilityRouter = require('./routes/calendarAvailability');

const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS and JSON parsing for normal routes
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO on the same HTTP server instance
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

// Serve static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/requests/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/schedules/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/images', express.static(path.join(__dirname, 'assets', 'images')));

// WEBHOOK: use raw body (only if you need raw body for signature verification like Stripe)
app.post(
  '/api/requests/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    next();
  }
);

// Mount routers
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/shares', shareRoutes);
app.use('/api/payments', paymentsRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/calendar', calendarAvailabilityRouter);
app.use('/api/testimonials', testimonialsRoute);

// mount admin calendar routes with io
app.use('/api/admin/calendar', adminCalendarRouterFactory(io));

// Generic error handler (helps debugging 500s)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err?.message || 'Internal Server Error' });
});

app.use('/api', uploadRoutes);

// Connect to MongoDB and start the HTTP server (shared by Express and Socket.IO)
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  server.listen(PORT, () => {
    console.log(`🚀 Server + Socket.IO listening on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});