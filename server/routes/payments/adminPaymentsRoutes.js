const express = require("express");
const router = express.Router();
const Payment = require("../../models/Payments");

// GET all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// POST approve
router.post("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const updated = await Payment.findByIdAndUpdate(
      id,
      { status: "confirmed", adminNotes: notes },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to approve payment" });
  }
});

// POST reject
router.post("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const updated = await Payment.findByIdAndUpdate(
      id,
      { status: "rejected", adminNotes: notes },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to reject payment" });
  }
});

module.exports = router;