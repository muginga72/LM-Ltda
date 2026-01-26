require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Server } = require('socket.io');
const cors = require('cors');

// --- Route imports (keep your existing routes) ---
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
const roomListingRequestRoutes = require('./routes/roomrental/roomListingRequestRoutes');
const adminCalendarRouterFactory = require('./routes/adminCalendar');
const calendarAvailabilityRouter = require('./routes/calendarAvailability');
const roomsRoutes = require('./routes/roomrental/roomRoutes');
const uploadsRouter = require('./routes/uploads/uploads');
const roomRequestRoutes = require('./routes/roomrental/roomRequestRoutes');
const bookingRoutes = require('./routes/roomrental/bookingRoutes');
const adminListBookingsRoutes = require('./routes/roomrental/adminListBookingsRoutes');

// --- App setup ---
const app = express();
app.set('trust proxy', true); // important when behind Render's proxy/load balancer
app.use(helmet());
app.use(morgan('dev'));

// Build CLIENT_ORIGIN safely
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || "").trim() || null;
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.lmuginga.com',
  CLIENT_ORIGIN,
].filter(Boolean);

// Helper to check origin safely
function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  // Allow Render app domains
  try {
    const u = new URL(origin);
    if (u.hostname && u.hostname.endsWith('.onrender.com')) return true;
  } catch (e) {
    // ignore parse errors
  }
  if (CLIENT_ORIGIN) {
    try {
      const clientHost = new URL(CLIENT_ORIGIN).hostname;
      const originHost = new URL(origin).hostname;
      if (originHost === clientHost) return true;
      // allow www vs non-www variants
      if (originHost === `www.${clientHost}` || `www.${originHost}` === clientHost) return true;
    } catch (e) {}
  }
  // Allow localhost patterns
  if (/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

// --- CORS for REST endpoints (Express) ---
app.use(cors({
  origin: (origin, cb) => {
    if (isOriginAllowed(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization', 'cache-control', 'X-Requested-With'],
  optionsSuccessStatus: 204,
}));

// --- Body parsers ---
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// --- Create HTTP server and Socket.IO with explicit CORS ---
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) return callback(null, true);
      return callback(new Error('Socket.IO CORS not allowed'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id, 'handshake address:', socket.handshake.address);
  socket.on('join-room', (roomId) => {
    console.log('join-room', roomId, socket.id);
    socket.join(roomId);
    io.to(roomId).emit('user-joined', { id: socket.id });
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', socket.id, 'reason:', reason);
  });

  socket.on('error', (err) => {
    console.error('Socket error on', socket.id, err);
  });
});

// Engine-level connection error (handshake) logging
io.engine.on('connection_error', (err) => {
  console.error('Socket.IO engine connection_error:', err);
});

// --- Ensure uploads dir exists and is exposed ---
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  console.warn(`uploads directory not found, creating at ${UPLOADS_DIR}`);
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
// Multer store uploads in uploads directory
const multerUpload = multer({
  dest: UPLOADS_DIR,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    if (file && file.mimetype && (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')) cb(null, true);
    else cb(null, false);
  },
});

// Allow cross-origin image use for uploads static route
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Serve uploads as static files
app.use('/uploads', express.static(UPLOADS_DIR, {
  index: false,
  maxAge: '1d',
}));

app.use('/api/uploads', uploadsRouter);
app.use('/api/images', express.static(path.join(__dirname, 'assets', 'images')));

async function getServicesFromDB() {
  try {
    const Service = mongoose.models.Service || (() => {
      try {
        return require('./models/Service');
      } catch (e) {
        return null;
      }
    })();

    if (Service && typeof Service.find === 'function') {
      const docs = await Service.find({}).lean().exec();
      return docs || [];
    }
  } catch (e) {
    console.error('getServicesFromDB error:', e);
  }
  return null;
}

app.get('/api/services', async (req, res) => {
  try {
    const raw = await getServicesFromDB(); // may be null or array
    const services = Array.isArray(raw) ? raw : [];
    return res.status(200).json(services);
  } catch (err) {
    console.error('Services endpoint error:', err);
    return res.status(200).json([]); // keep contract: always return array
  }
});

// --- Mount other API routes (keep your existing routes) ---
// Mount the rest of your routes after the defensive GET so they can still handle other verbs and subpaths
app.use('/api', uploadFilesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/cards', cardsRoutes);
// servicesRoutes remains mounted for other methods and subpaths (e.g., POST /api/services, /api/services/:id)
app.use('/api/services', servicesRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/shares', shareRoutes);
app.use('/api/contact', contactRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/calendar', calendarAvailabilityRouter);
app.use('/api/testimonials', testimonialsRoute);

// Room rental routes
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/room-listing-request', roomListingRequestRoutes);
app.use('/admin', adminListBookingsRoutes);

// Booking route (accepts JSON or multipart/form-data)
app.post('/api/bookings', multerUpload.single('idDocument'), (req, res) => {
  try {
    const isMultipart = !!req.file;
    const body = req.body || {};
    const roomId = body.roomId;
    const userId = body.userId;
    const startDate = body.startDate;
    const endDate = body.endDate;
    const guestsCount = body.guestsCount ? Number(body.guestsCount) : undefined;

    if (!roomId || !userId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'roomId, userId, startDate and endDate are required.' });
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      return res.status(400).json({ message: 'Invalid startDate or endDate format.' });
    }
    if (s > e) {
      return res
        .status(400)
        .json({ message: 'startDate must be before or equal to endDate.' });
    }
    if (isMultipart) {
      console.log('Received file:', req.file.originalname, 'stored at', req.file.path);
    }

    const booking = {
      roomId,
      userId,
      startDate,
      endDate,
      guestsCount,
      file: isMultipart
        ? { originalname: req.file.originalname, path: req.file.path }
        : undefined,
    };

    return res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error('Booking route error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.use('/api/room-requests', roomRequestRoutes);
app.use('/api/admin/calendar', adminCalendarRouterFactory(io));
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

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
  if (err && err.name === 'MulterError') {
    const status = 400;
    return res.status(status).json({
      error: err.code || 'MULTER_ERROR',
      message: err.message || 'File upload error',
    });
  }

  console.error('Unhandled error:', err);
  res.status(err?.status || 500).json({ error: err?.message || 'Internal Server Error' });
});

// --- Start DB + server ---
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`🚀 Server + Socket.IO listening on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ') || 'none configured'}`);
    if (CLIENT_ORIGIN) console.log(`CLIENT_ORIGIN: ${CLIENT_ORIGIN}`);
  });
};

// Connect to MongoDB (non-blocking start)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    startServer();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Start server anyway so you can debug socket/CORS issues even if DB is down
    startServer();
  });