const express = require("express");
const Admin = require("../models/admin");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const authenticateToken = require("../middleware/authMiddleware"); 
require("dotenv").config(); // Load environment variables
// Log request headers for all incoming requests
router.use((req, res, next) => {
  // Log incoming request headers
  // console.log('Request Headers:', req.headers); 
  next(); // Move to the next middleware or route handler
});

router.post("/admin-login", async (req, res) => {
  console.log("Incoming Request:", req.body);
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    console.log(admin,1122)
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid =  await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    // const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // Send back the admin's name, profession, profileImage, role, and token
    return res.status(200).json({
      message: "Login successful",
      // token,
      name: admin.name, // Assuming 'name' is a field in your admin model
      profession: admin.profession, // Assuming 'profession' is a field in your admin model
      profileImage: admin.profileImage,
      role: admin.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/userData", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: user.email });
    // Handle fetching user data logic here
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

module.exports = router;
