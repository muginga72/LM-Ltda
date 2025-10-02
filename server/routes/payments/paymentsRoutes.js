const express = require('express');
const router = express.Router();
const multer = require("multer");
const CustomerPayments = require("../../models/Payments");

const upload = multer({ dest: "uploads/" });

// USER: create a new payment record
router.post("/", async (req, res) => {
  try {
    const { orderId, userId, amount, currency, referenceCode } = req.body;
    const payment = new CustomerPayments({
      paymentId: `pay_${Date.now()}`, // or use uuid
      orderId,
      userId,
      amount,
      currency,
      referenceCode,
      status: "pending_payment",
    });
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// USER: upload proof of payment
router.post("/:id/proof", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const updated = await CustomerPayments.findByIdAndUpdate(
      id,
      {
        proofFileUrl: `/uploads/${req.file.filename}`,
        status: "under_review",
        userNotes: notes,
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload proof" });
  }
});

module.exports = router;