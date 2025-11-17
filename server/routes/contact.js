// server/routes/contact.js
const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// simple server-side validators
const isValidEmail = (s) => /\S+@\S+\.\S+/.test(s);
const isValidPhone = (s) => /^[\d\s()+-]{7,20}$/.test(s);

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone" });
    }

    const saved = await ContactMessage.create({
      name,
      email,
      phone,
      message,
      ip: req.ip,
      userAgent: req.get("User-Agent") || "",
    });

    return res.status(201).json({ id: saved._id, message: "Saved" });
  } catch (err) {
    console.error("Contact POST error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/contact — fetch all messages
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

module.exports = router;