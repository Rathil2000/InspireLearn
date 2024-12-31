const express = require("express");
const User = require("../models/user");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Import bcrypt for password comparison

router.post("/user-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token if authentication is successful
    const token = jwt.sign({ email: user.email }, "your_jwt_secret_key", {
      expiresIn: "1h",
    });

    // Send back the user's name, profession, profileImage, role, and token
    return res.status(200).json({
      message: "Login successful",
      token,
      name: user.name, // Assuming 'name' is a field in your user model
      profession: user.profession, // Assuming 'profession' is a field in your user model
      profileImage: user.profileImage, // Assuming 'profileImage' exists in your user model
      role: user.role, // Assuming 'role' exists in your user model
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
