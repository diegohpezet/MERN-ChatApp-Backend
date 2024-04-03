const bcrypt = require('bcrypt')

// Import user model
const User = require("../models/User");
const generateToken = require('../utils/generateToken');

/*-- Controllers --*/

// @desc Login
// @route POST /auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const match = await bcrypt.compare(password, user?.password || "");  // Check if password is correct

    if (!user || !match) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Generate JWT
    generateToken(user._id, res);

    // Return user data
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Sever Error" })
  }
}

// @desc Register
// @route POST /auth/signup
// @access Public
const register = async (req, res) => {
  try {
    const { username, fullName, email, password, confirmPassword } = req.body;

    // Check for valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    };

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Check username & email availability
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ error: "Chosen username is already in use" });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ error: "E-mail address already in use" });

    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Give default profile picture
    const avatar = `https://api.dicebear.com/8.x/bottts/jpg?seed=${username}`

    // Save user
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
      avatar
    })

    // Generate JWT
    generateToken(newUser._id, res);
    await newUser.save();

    return res.status(200).json({
      _id: newUser._id,
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email, //check login 
      avatar: newUser.avatar
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 })
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = { login, register, logout }