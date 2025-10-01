// scripts/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL;
    const existing = await User.findOne({ email });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        name: 'Laurindo Muginga',
        email,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Laurindo Muginga seeded as admin');
    } else {
      console.log('Laurindo already exists');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();