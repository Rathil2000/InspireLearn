const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Ensure the uploads/userProfilePic directory exists
const uploadDir = path.join(__dirname, "../uploads/userProfilePic");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the destination to userProfilePic folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add a timestamp to the file name
  },
});

const upload = multer({ storage });

// Register User
router.post(
  "/register-user",
  upload.single("profileImage"),
  async (req, res) => {
    const { name, profession, email, password } = req.body;
    role = "user";
    try {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email already exists. Please use another email." });
      }

      // Get the file path relative to the server
      const profileImagePath = `uploads/userProfilePic/${req.file.filename}`;

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10
      // If email is unique, proceed with registration
      const newUser = {
        name,
        role,
        profession,
        email,
        password:hashedPassword,
        profileImage: profileImagePath, // Save the relative path to the database
      };

      const registeredUser = await User.create(newUser);
      res
        .status(201)
        .json({
          message: "User registered successfully",
          user: registeredUser,
        });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// API to fetch user data (authenticated route)
router.get("/api/user", (req, res) => {
  // In a real-world scenario, you would fetch the user from a database

  User.findOne()
    .then((userData) => {
      res.json(userData); // Send the response with the admin data
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Error fetching user data" });
    });
});
module.exports = router;
