const jwt = require('jsonwebtoken');

const User = require('../models/User');

const checkSession = async (req, res, next) => {
  try {
    const { token }  = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) return res.status(401).json({ error: "Unauthorized - Invalid token" });

    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) return res.json({ error: "User not found" });

    // Store user variable
    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = checkSession