require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d'
  });

  res.cookie("token", token, {
    httpOnly: false,
    maxAge: 15 * 24 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development"
  });
}

module.exports = generateToken;