const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const User = require("../models/user"); // Assuming you have a User model in your MongoDB database
const Admin = require("../models/admin");
// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/userProfilePic/"); // Define the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + path.extname(file.originalname)); // Store file with a unique timestamp
  },
});

const upload = multer({ storage: storage });

// Update user profile route
router.put(
  "/update-userProfile",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      // console.log("waiting....");
      const { name, profession, email, old_pass, new_pass, c_pass } = req.body;

      // Find the user by email
      const user = await User.findOne({ email }); // Find the user using the provided email

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Password validation
      if (old_pass && new_pass && c_pass) {
        const isPasswordValid = bcrypt.compare(old_pass, user.password); // Compare old password
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Incorrect old password" });
        }

        if (new_pass !== c_pass) {
          return res.status(400).json({ message: "Passwords do not match" });
        }

        // If passwords match, hash the new password
        const hashedPassword = await bcrypt.hash(new_pass, 10); // Hash new password
        user.password = hashedPassword;
      }

      // Update user information
      if (name) user.name = name;
      if (email) user.email = email;
      if (profession) user.profession = profession;

      // Handle profile picture upload if exists
      if (req.file) user.profileImage = req.file.path;

      await user.save(); // Save the updated user information

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Update admin profile route
router.put(
  "/update-adminProfile",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      console.log("waiting....");
      const { name, profession, email, old_pass, new_pass, c_pass } = req.body;

      // Find the user by email
      const admin = await Admin.findOne({ email }); // Find the user using the provided email

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Password validation
      if (old_pass && new_pass && c_pass) {
        const isPasswordValid = bcrypt.compare(old_pass, admin.password); // Compare old password
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Incorrect old password" });
        }

        if (new_pass !== c_pass) {
          return res.status(400).json({ message: "Passwords do not match" });
        }

        // If passwords match, hash the new password
        const hashedPassword = await bcrypt.hash(new_pass, 10); // Hash new password
        admin.password = hashedPassword;
      }

      // Update user information
      if (name) admin.name = name;
      if (email) admin.email = email;
      if (profession) admin.profession = profession;

      // Handle profile picture upload if exists
      if (req.file) admin.profileImage = req.file.path;

      await admin.save(); // Save the updated user information

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get User Profile
router.get("/get-userProfile", async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email }); // Find user by ID
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      name: user.name,
      profession: user.profession,
      role: user.role,
      email: user.email,
      profileImage: user.profileImage, // Adjust field names as per your schema
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Admin Profile
router.get("/get-adminProfile", async (req, res) => {
  try {
    const email = req.query.email;
    console.log(email, 66666);
    const admin = await Admin.findOne({ email }); // Find admin by ID
    console.log(admin, 1212112);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({
      name: admin.name,
      profession: admin.profession,
      role: admin.role,
      email: admin.email,
      profileImage: admin.profileImage, // Adjust field names as per your schema
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
