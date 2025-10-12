const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const ServiceRequest = require("../../models/ServiceRequest");
const ServiceSchedule = require("../../models/ServiceSchedule");

// POST /api/payments/proof-payment-received
router.post("/proof-payment-received", async (req, res) => {
  const {
    fullName,
    serviceId,
    userEmail,
    serviceTitle,
    amountPaid,
    totalAmount,
    submissionMethod,
    dateReceived,
    referenceId,
  } = req.body;

  if (!fullName || !userEmail || !serviceId || !serviceTitle || amountPaid == null || totalAmount == null) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Determine status
  const status = amountPaid >= totalAmount ? "paid" : "pending";

  try {
    // Try updating in ServiceRequest first
    let updated = await ServiceRequest.findByIdAndUpdate(
      fullName, serviceId, userEmail,
      { status, paid: status === "paid" },
      { new: true }
    );

    // If not found, try ServiceSchedule
    if (!updated) {
      updated = await ServiceSchedule.findByIdAndUpdate(
        fullName, serviceId, userEmail,
        { status, paid: status === "paid" },
        { new: true }
      );
    }

    if (!updated) {
      return res.status(404).json({ message: "Service not found." });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    // Build email body
    const mailText =
      status === "paid"
        ? `Hello,

We have received your full payment of $${amountPaid} for the service "${serviceTitle}" (ID: ${serviceId}).

Submission Method: ${submissionMethod}
Date Received: ${dateReceived}
Reference/Transaction ID: ${referenceId}

Your status has been updated to "Paid". Thank you for completing your payment.

Best regards,
LM Ltd Support Team`
        : `Hello,

We have received a partial payment of $${amountPaid} for the service "${serviceTitle}" (ID: ${serviceId}).

Submission Method: ${submissionMethod}
Date Received: ${dateReceived}
Reference/Transaction ID: ${referenceId}

Your status has been updated to "Pending". Please complete the remaining balance of $${totalAmount - amountPaid} to proceed.

Best regards,
LM Ltd Support Team`;

    const mailOptions = {
      from: `"LM Ltd Services" <${process.env.SUPPORT_EMAIL}>`,
      to: userEmail,
      subject: "Payment Confirmation - LM Ltd",
      text: mailText,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Payment confirmation email sent and status updated.",
      updated,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ message: "Server error while processing payment." });
  }
});

module.exports = router;