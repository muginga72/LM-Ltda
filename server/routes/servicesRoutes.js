// server/routes/servicesRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");              
const controller = require("../controllers/serviceController");
const Service = require("../models/Service");
const Payment = require("../models/Payment");
const { sendUserConfirmationEmail } = require("../lib/email");

const router = express.Router();

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // save uploads in /server/uploads
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// list services
router.get('/', async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
});

// get service by id
router.get('/:id', async (req, res) => {
  const s = await Service.findById(req.params.id);
  if (!s) return res.status(404).json({ error: 'not found' });
  res.json(s);
});

// Async wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET all services
router.get("/", asyncHandler(controller.listServices));

// GET single service by ID
router.get("/:id", asyncHandler(controller.getService));

// list payments for a service (admin)
router.get('/:id/payments', async (req, res) => {
  const payments = await Payment.find({ serviceId: req.params.id }).sort({ createdAt: -1 });
  res.json(payments);
});

// Admin confirms payment (full or half) -> updates payment.status and service.status and optionally emails payer
// Expected body: { paymentId, type: 'full'|'half', notify: true|false }
router.patch('/:id/confirm-payment', async (req, res) => {
  try {
    const { paymentId, type, notify = true } = req.body;
    if (!paymentId || !['full','half'].includes(type)) return res.status(400).json({ error: 'paymentId and valid type required' });

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'payment not found' });

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'service not found' });

    payment.status = type === 'full' ? 'confirmed_full' : 'confirmed_half';
    await payment.save();

    service.status = type === 'full' ? 'paid_full' : 'paid_half';
    await service.save();

    if (notify && payment.payerEmail) {
      try { await sendUserConfirmationEmail({ toEmail: payment.payerEmail, service, payment, type }); } catch (e) { console.error('user email failed', e); }
    }

    res.json({ ok: true, payment, service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST create new service with image upload
router.post("/", upload.single("image"), asyncHandler(controller.createService));
router.put("/:id", upload.single("image"), asyncHandler(controller.updateService));
router.delete("/:id", asyncHandler(controller.deleteService));

module.exports = router;