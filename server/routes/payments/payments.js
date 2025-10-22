// routes/payments/payments.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Service = require("../../models/Service");
const Payment = require("../../models/Payment");
const { sendAdminProofEmail } = require("../../lib/email");

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

// Upload proof (user dashboard). Accepts multipart form:
router.post("/upload-proof", upload.single("proof"), async (req, res) => {
  try {
    const {
      serviceId,
      payerName,
      payerEmail,
      amountPaid,
      submissionMethod,
      dateReceived,
      referenceId,
    } = req.body;

    // Validate required fields
    if (!serviceId || !payerEmail) {
      return res
        .status(400)
        .json({ error: "serviceId and payerEmail are required" });
    }

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Create new payment record
    const payment = new Payment({
      serviceId: service._id,
      payerName: payerName || "",
      payerEmail,
      amountPaid: amountPaid ? Number(amountPaid) : 0,
      submissionMethod: submissionMethod || "",
      dateReceived: dateReceived ? new Date(dateReceived) : new Date(),
      referenceId: referenceId || "",
      proofPath: req.file ? `/uploads/${req.file.filename}` : undefined,
      status: "pending",
    });

    await payment.save();

    router.get("/paid-services", async (req, res) => {
      const paid = await Payment.find({ status: "paid" });
      res.json(paid);
    });

    // Try sending admin email (non-blocking)
    try {
      await sendAdminProofEmail({ payment, service });
    } catch (e) {
      console.error("Admin email failed:", e);
    }

    return res.json({ ok: true, payment });
  } catch (err) {
    console.error("Upload-proof error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
