// server/controllers/userController.js
const User = require('../models/User');

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, avatar } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateProfile };