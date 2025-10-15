const Payment = require("../models/Payments");
const transporter = require("../config/mailer");

// @desc Upload payment proof
// @route POST /api/payments/upload
const uploadPaymentProof = async (req, res) => {
  try {
    const payment = new Payment({
      fullName: req.body.fullName,
      email: req.body.email,
      serviceId: req.body.serviceId,
      fileId: req.file.id,
      fileName: req.file.filename,
      status: "unpaid",
    });
    await payment.save();

    // Notify admin
    await transporter.sendMail({
      from: `"LM Ltd Payments" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_NOTIFY,
      subject: "📬 New Payment Proof Uploaded",
      html: `
        <h3>New Payment Proof Received</h3>
        <p><strong>User:</strong> ${payment.fullName}</p>
        <p><strong>User:</strong> ${payment.email}</p>
        <p><strong>Service:</strong> ${payment.serviceId}</p>
        <p><strong>File:</strong> ${payment.fileName}</p>
        <p><strong>Status:</strong> ${payment.status}</p>
      `,
    });

    res.json({ message: "File uploaded, admin notified", payment });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
};

// @desc Update payment status
// @route PUT /api/payments/:id/status
const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (payment.status === "paid") {
      await transporter.sendMail({
        from: `"LM Ltd Payments" <${process.env.ADMIN_EMAIL}>`,
        to: payment.email,
        subject: "Payment Verified",
        html: `
          <h3>Your payment has been verified</h3>
          <p>Dear ${payment.fullName}</p>
          <p>Email: ${payment.email}</p>
          <p>Service: ${payment.serviceId}</p>
          <p>Status: Paid</p>
          <p>Thank you for your payment!</p>
        `,
      });
    }

    res.json({ message: "Status updated", payment });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

module.exports = { uploadPaymentProof, updatePaymentStatus };