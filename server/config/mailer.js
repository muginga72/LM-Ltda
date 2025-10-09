// server/config/mailer.js
module.exports = {
  sendMail: (to, subject, body) => {
    console.log(`Pretend sending email to ${to}: ${subject}`);
  }
};