// server/lib/email.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Validate env vars early
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('⚠️ Missing SMTP credentials. Check your .env file.');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email to admin with payment proof (if file exists).
async function sendAdminProofEmail({ payment, service }) {
  const subject = `Payment proof received for ${service.title}`;
  const text = [
    `Service: ${service.title}`,
    `Payer: ${payment.payerName || payment.payerEmail}`,
    `Amount: ${payment.amountPaid}`,
    `Method: ${payment.submissionMethod || 'N/A'}`,
    `Reference: ${payment.referenceId || 'N/A'}`,
    `Date: ${payment.dateReceived?.toISOString?.() || 'N/A'}`,
  ].join('\n');

  const attachments = [];
  if (payment.proofPath) {
    const absPath = path.join(process.cwd(), payment.proofPath);
    if (fs.existsSync(absPath)) {
      attachments.push({
        filename: path.basename(absPath),
        path: absPath,
      });
    } else {
      console.warn(`⚠️ Proof file not found, skipping attachment: ${absPath}`);
    }
  }

  const mail = {
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
    attachments,
  };

  return transporter.sendMail(mail);
}

// Send confirmation email to user after admin marks payment.
async function sendUserConfirmationEmail({ toEmail, service, payment, type }) {
  const subject =
    type === 'full'
      ? `Payment confirmed for ${service.title}`
      : `Partial payment recorded for ${service.title}`;

  const text =
  type === 'full'
    ? `Hello,\n\nWe have received your full payment of $${(
        payment.amountPaid || 0
      ).toFixed(2)} for "${service.title}". Thank you.\n\n🎉 As a valued customer, you're invited to explore our latest services and exclusive offers! Visit our website or dashboard to discover new features, seasonal promotions, and personalized recommendations tailored just for you.`
    : `Hello,\n\nWe have recorded a partial payment of $${(
        payment.amountPaid || 0
      ).toFixed(2)} for "${service.title}". Please pay the remaining balance when ready.\n\n💡 While you're here, check out our newest services and special deals! We’re constantly adding fresh features and promotions to help you get the most out of your experience. Visit your dashboard or our homepage to learn more.`;

  const mail = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject,
    text,
  };

  return transporter.sendMail(mail);
}

module.exports = { sendAdminProofEmail, sendUserConfirmationEmail };