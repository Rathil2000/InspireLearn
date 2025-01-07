const express = require("express");
const multer = require("multer");
const { s3Client, getObjectURL, upload } = require("../utils/awsS3Utils"); // Import AWS utilities
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const Course = require("../models/course");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// AWS S3 bucket name
const BUCKET_NAME = "inspirelearn-files-upload";


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

      let thumbnailURL = null;
      let videoURL = null;
      let notesURL = null;

      if (req.files.thumbnail) {
        const fileName = `${Date.now()}-${req.files.thumbnail[0].originalname}`;
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: `uploads/courseThumbnails/${fileName}`,
          Body: req.files.thumbnail[0].buffer,
          ContentType: req.files.thumbnail[0].mimetype,
        };

        const s3Response = await s3Client.send(new PutObjectCommand(uploadParams));
        thumbnailURL = await getObjectURL(`uploads/courseThumbnails/${fileName}`);
      }

      if (req.files.video) {
        const fileName = `${Date.now()}-${req.files.video[0].originalname}`;
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: `uploads/courseVideos/${fileName}`,
          Body: req.files.video[0].buffer,
          ContentType: req.files.video[0].mimetype,
        };

        const s3Response = await s3Client.send(new PutObjectCommand(uploadParams));
        videoURL = await getObjectURL(`uploads/courseVideos/${fileName}`);
      }

      if (req.files.notes) {
        const fileName = `${Date.now()}-${req.files.notes[0].originalname}`;
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: `uploads/courseNotes/${fileName}`,
          Body: req.files.notes[0].buffer,
          ContentType: req.files.notes[0].mimetype,
        };

        const s3Response = await s3Client.send(new PutObjectCommand(uploadParams));
        notesURL = await getObjectURL(`uploads/courseNotes/${fileName}`);
      }

      const course = new Course({
        title,
        description,
        status,
        playlist,
        thumbnail: thumbnailURL,
        video: videoURL,
        notes: notesURL,
      });

      await course.save();
      res.status(201).json({ message: "Course added successfully", course });
    } catch (error) {
      console.error("Error while saving course:", error);
      res.status(500).json({ message: "Error adding course", error: error.message });
    }
  }
);

// Fetch Courses API
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Get a single course by ID
router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Error fetching course" });
  }
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
        const fileName = `${Date.now()}-${req.files.thumbnail[0].originalname}`;
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: `uploads/courseThumbnails/${fileName}`,
          Body: req.files.thumbnail[0].buffer,
          ContentType: req.files.thumbnail[0].mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        updateData.thumbnail = await getObjectURL(`uploads/courseThumbnails/${fileName}`);
      }

      if (req.files.video) {
        const fileName = `${Date.now()}-${req.files.video[0].originalname}`;
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: `uploads/courseVideos/${fileName}`,
          Body: req.files.video[0].buffer,
          ContentType: req.files.video[0].mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        updateData.video = await getObjectURL(`uploads/courseVideos/${fileName}`);
      }

      if (req.files.notes) {
        const fileName = `${Date.now()}-${req.files.notes[0].originalname}`;
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: `uploads/courseNotes/${fileName}`,
          Body: req.files.notes[0].buffer,
          ContentType: req.files.notes[0].mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        updateData.notes = await getObjectURL(`uploads/courseNotes/${fileName}`);
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
