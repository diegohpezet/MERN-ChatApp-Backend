const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const query = req.query;
    console.log(query)
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!!" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const userData = await User.findOne({ _id: targetUserId }).select("-password");

    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!!" });
  }
};

module.exports = { getAllUsers, getSingleUser };