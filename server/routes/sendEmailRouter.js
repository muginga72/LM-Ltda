const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { from, to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lmj.muginga@gmail.com", // this is the authenticated sender (your app's email)
        pass: "your-app-password",
      },
    });

    await transporter.sendMail({
      from: `"LM Ltd Services" <${from}>`, // dynamically use user's email as the visible sender
      to,
      subject,
      text,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;