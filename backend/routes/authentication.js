const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");

// User Registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name : username, email, password: password });
  await user.save();
  res.json({ message: "User registered" });
});



// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // if (!user || !(await bcrypt.compare(password, user.password))) {
  //   return res.status(401).json({ message: "Invalid credentials" });
  // }
  if (!user || password != user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});


module.exports = router;
