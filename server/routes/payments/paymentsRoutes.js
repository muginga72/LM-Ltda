// const express = require('express');
// const router = express.Router();
// const multer = require("multer");
// const nodemailer = require('nodemailer');
// const CustomerPayments = require("../../models/Payments");

// const upload = multer({ dest: "uploads/" });

// // USER: create a new payment record
// router.post("/", async (req, res) => {
//   try {
//     const { orderId, userId, amount, currency, referenceCode } = req.body;
//     const payment = new CustomerPayments({
//       paymentId: `pay_${Date.now()}`, // or use uuid
//       orderId,
//       userId,
//       amount,
//       currency,
//       referenceCode,
//       status: "pending_payment",
//     });
//     await payment.save();
//     res.json(payment);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create payment" });
//   }
// });

// // USER: upload proof of payment
// router.post("/:id/proof", upload.single("file"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { notes } = req.body;
//     const updated = await CustomerPayments.findByIdAndUpdate(
//       id,
//       {
//         proofFileUrl: `/uploads/${req.file.filename}`,
//         status: "under_review",
//         userNotes: notes,
//       },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to upload proof" });
//   }
// });

// router.post('/send-payment-email', async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: 'Email is required.' });

//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail', // or your SMTP provider
//       auth: {
//         user: process.env.SUPPORT_EMAIL,
//         pass: process.env.SUPPORT_EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.SUPPORT_EMAIL,
//       to: process.env.SUPPORT_EMAIL,
//       subject: 'Payment Verification Request',
//       text: `User ${email} has requested payment support via dashboard.`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.json({ message: 'Support email sent successfully.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to send email.' });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const upload = require("../../utils/gridfsStorage");
const { uploadPaymentProof, updatePaymentStatus } = require("../../controllers/paymentsController");

router.post("/upload", upload.single("document"), uploadPaymentProof);
router.put("/:id/status", updatePaymentStatus);

module.exports = router;