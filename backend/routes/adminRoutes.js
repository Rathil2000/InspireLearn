const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { s3Client, getObjectURL, upload } = require('../utils/awsS3Utils');
const { PutObjectCommand  } = require('@aws-sdk/client-s3');
// Ensure the uploads/userProfilePic directory exists
const uploadDir = path.join(__dirname, '../uploads/adminProfilePic');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


// Register Admin
router.post('/register-admin', upload.single('profileImage'), async (req, res) => {
  const { name, profession, email, password } = req.body;
  const role = 'admin';

  try {
    // Check if the email already exists in the database
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists. Please use another email.' });
    }

    let profileImagePath = null;

    // Upload the profile image to S3 if provided
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const uploadParams = {
        Bucket: 'inspirelearn-files-upload',
        Key: `uploads/adminProfilePic/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      // Upload to S3
      await s3Client.send(new PutObjectCommand(uploadParams));

     // Generate a signed URL for accessing the uploaded image
     profileImagePath = await getObjectURL(`uploads/adminProfilePic/${fileName}`);
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin object
    const newAdmin = new Admin({
      name,
      role,
      profession,
      email,
      password: hashedPassword,
      profileImage: profileImagePath, // Store the S3 URL of the image
    });

    // Save the new admin to the database
    const registeredAdmin = await newAdmin.save();

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
