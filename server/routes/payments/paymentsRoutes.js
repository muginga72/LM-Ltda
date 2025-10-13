// routes/payments/paymentsRouter.js
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/send-payment-email", upload.single("attachment"), async (req, res) => {
  const { fullName, userEmail, serviceId } = req.body;
  const file = req.file;

  if (!fullName || !userEmail || !serviceId || !file) {
    return res.status(400).json({ message: "Missing userEmail, serviceId, or attachment." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"LM Ltd Services" <${process.env.SUPPORT_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Payment Proof Notification",
      text: `Name: ${fullName}\n\nUser: ${userEmail}\n\nHas submitted payment for service ID: ${serviceId}.\n\nPlease verify and update the payment status on the dashboard.\n\nThank you!`,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Support email sent successfully." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send support email." });
  }
});

module.exports = router;