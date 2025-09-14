// server/utils/generateToken.js
const jwt = require('jsonwebtoken');

module.exports = function generateToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};