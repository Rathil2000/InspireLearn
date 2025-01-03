const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { S3Client, PutObjectCommand,GetObjectCommand  } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const authenticateToken = require("../middleware/authMiddleware");
// Ensure the uploads/userProfilePic directory exists
const uploadDir = path.join(__dirname, '../uploads/adminProfilePic');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// AWS S3 Configuration
const s3Client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to generate a signed URL for accessing objects
async function getObjectURL(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: 'inspirelearn-files-upload',
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error.message);
    throw error;
  }
}

// Multer Configuration (for temporary file storage before uploading to S3)
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
