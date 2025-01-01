const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
// Ensure the uploads/userProfilePic directory exists
const uploadDir = path.join(__dirname, '../uploads/adminProfilePic');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder for admin profile pictures
    const adminProfilePicFolder = path.join(__dirname, '../uploads/adminProfilePic/');
    cb(null, adminProfilePicFolder);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each uploaded image
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer
const upload = multer({ storage });

// Register Admin
router.post('/register-admin', upload.single('profileImage'), async (req, res) => {
  const { name, profession, email, password } = req.body;
  role="admin";
  // Get the uploaded profile image path
  const profileImagePath = req.file ? `uploads/adminProfilePic/${req.file.filename}` : null;

  // try {
  //   // Check if the email already exists in the database
  //   const existingUser = Admin.findOne({ email });
  //   if (existingUser) {
  //     return res.status(400).json({ message: 'Email already exists. Please use another email.' });
  //   }

 // Hash the password using bcrypt
 const hashedPassword = bcrypt.hash(password, 10); // Salt rounds set to 10
    // Create a new admin object
    const newAdmin = {
      name,
      role,
      profession,
      email,
      password:hashedPassword,
      profileImage: profileImagePath, // Store the relative image path
    };

    // Save the new admin to the database
    const registeredAdmin = Admin.create(newAdmin);

    res.status(201).json({ message: 'Admin registered successfully', admin: registeredAdmin });
  } catch (error) {
    console.error('Error during admin registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API to fetch user data (authenticated route)
router.get('/api/admin', (req, res) => {
  // In a real-world scenario, you would fetch the user from a database
  Admin.findOne()
    .then(adminData => {
      res.json(adminData); // Send the response with the admin data
    })
    .catch(error => {
      console.error('Error fetching admin data:', error);
      res.status(500).json({ message: 'Error fetching admin data' });
    });
});
module.exports = router;
