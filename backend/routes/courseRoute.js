const express = require("express");
const multer = require("multer");
const Course = require("../models/course");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
// Function to create folders if they don't exist
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Multer setup for video, thumbnail, and notes upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder =
      file.fieldname === "video"
        ? "videos"
        : file.fieldname === "notes"
        ? "notes"
        : "thumbnails";
    cb(null, `./uploads/${folder}`);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
// Ensure the directories exist before handling file uploads
const videoFolder = path.join(__dirname, "..", "uploads", "videos");
const thumbnailFolder = path.join(__dirname, "..", "uploads", "thumbnails");
const notesFolder = path.join(__dirname, "..", "uploads", "notes");
createFolderIfNotExists(videoFolder);
createFolderIfNotExists(thumbnailFolder);
createFolderIfNotExists(notesFolder);
// Add a course
router.post(
  "/courses",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "notes", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, status, playlist } = req.body;
     
    
      const course = new Course({
        title,
        description,
        status,
        playlist,
        thumbnail: req.files.thumbnail ? req.files.thumbnail[0].path : null,
        video: req.files.video ? req.files.video[0].path : null,
        notes: req.files.notes ? req.files.notes[0].path : null,
      });

      await course.save();
      res.status(201).json({ message: "Course added successfully", course });
    } catch (error) {
      console.error("Error while saving course:", error); // Log error details
      res
        .status(500)
        .json({ message: "Error adding course", error: error.message });
    }
  }
);

// Fetch Courses API
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }); // Fetch all courses, sorted by creation date
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get('/courses/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Course not found');
  res.json(course);
});

// Update a course by ID
router.put(
  "/courses/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "notes", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, status, playlist } = req.body;
      const courseId = req.params.id;

      const updateData = {
        title,
        description,
        status,
        playlist,
      };

      // Add files if they are uploaded
      if (req.files.thumbnail) {
        updateData.thumbnail = req.files.thumbnail[0].path;
      }
      if (req.files.video) {
        updateData.video = req.files.video[0].path;
      }
      if (req.files.notes) {
        updateData.notes = req.files.notes[0].path;
      }

      const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course updated successfully", updatedCourse });
    } catch (error) {
      console.error("Error while updating course:", error);
      res.status(500).json({ message: "Error updating course", error: error.message });
    }
  }
);

// Delete a course by ID
router.delete("/courses/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Optionally delete files from the file system
    if (course.thumbnail) fs.unlinkSync(course.thumbnail);
    if (course.video) fs.unlinkSync(course.video);
    if (course.notes) fs.unlinkSync(course.notes);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error while deleting course:", error);
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
});

// Search courses by title or description
router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    // Perform a case-insensitive search on title and description
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'An error occurred while searching for courses.' });
  }
});


module.exports = router;
