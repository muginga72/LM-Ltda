// // routes/payments/paymentsRouter.js
// const express = require("express");
// const nodemailer = require("nodemailer");
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();

// // Configure multer for file upload
// // const storage = multer.memoryStorage();
// // const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

// router.post("/send-payment-email", upload.single("attachment"), async (req, res) => {
//   const { fullName, email, serviceId } = req.body;
//   const file = req.file;

//   if (!fullName || !email || !serviceId || !file) {
//     return res.status(400).json({ message: "Missing email, serviceId, or attachment." });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.SUPPORT_EMAIL,
//         pass: process.env.SUPPORT_EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: `"LM Ltd Services" <${process.env.SUPPORT_EMAIL}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: "Payment Proof Notification",
//       text: `Name: ${fullName}\n\nUser: ${email}\n\nHas submitted payment for service ID: ${serviceId}.\n\nPlease verify and update the payment status on the dashboard.\n\nThank you!`,
//       attachments: [
//         {
//           filename: file.originalname,
//           content: file.buffer,
//           contentType: file.mimetype,
//         },
//       ],
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "Support email sent successfully." });
//   } catch (error) {
//     console.error("Email error:", error);
//     res.status(500).json({ error: "Failed to send support email." });
//   }
// });

// module.exports = router;

const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const router = express.Router();

const ServiceRequest = require("../../models/ServiceRequest");
const ServiceSchedule = require("../../models/ServiceSchedule");
const User = require("../../models/User");

// Use memory storage so file.buffer is available
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Fetch service + user info by serviceId
 * Tries ServiceRequest first, then ServiceSchedule
 */
// If router is mounted at /api/service
router.get("/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;

    let service = await ServiceRequest.findById(serviceId).populate("user");
    if (!service) {
      service = await ServiceSchedule.findById(serviceId).populate("user");
    }

    if (!service || !service.user) {
      return res.status(404).json({ message: "Service or user not found" });
    }

    res.json({
      fullName: service.user.fullName,
      email: service.user.email,
      serviceId: service._id,
    });
  } catch (err) {
    console.error("Fetch service error:", err);
    res.status(500).json({ message: "Failed to fetch service info" });
  }
});

/**
 * Send payment proof email with attachment
 */
router.post(
  "/send-payment-email",
  upload.single("attachment"),
  async (req, res) => {
    const { fullName, email, serviceId } = req.body;
    const file = req.file;

    if (!fullName || !email || !serviceId || !file || !file.buffer) {
      return res
        .status(400)
        .json({ message: "Missing email, serviceId, or attachment." });
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
        text: `Name: ${fullName}\n\nUser: ${email}\n\nHas submitted payment for service ID: ${serviceId}.\n\nPlease verify and update the payment status on the dashboard.\n\nThank you!`,
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
  }
);

module.exports = router;