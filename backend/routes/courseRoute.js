const express = require("express");
const multer = require("multer");
const {  getObjectURL,upload } = require("../utils/awsS3Utils"); 
const {S3Client, PutObjectCommand ,CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand} = require("@aws-sdk/client-s3");
const Course = require("../models/course");
const router = express.Router();

// AWS S3 bucket name
const BUCKET_NAME = "inspirelearn-files-upload";

const REGION = 'eu-north-1'; // Replace with your AWS region
const s3Client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const multipartUpload = async (bucket, key, file) => {
  try {
    console.log("Region:", REGION);
    console.log("Bucket:", bucket);
    console.log("Key:", key);

    const createMultipartUploadParams = {
      Bucket: bucket,
      Key: key,
    };

    // Start multipart upload
    const createResponse = await s3Client.send(new CreateMultipartUploadCommand(createMultipartUploadParams));
    const uploadId = createResponse.UploadId;
    console.log("UploadId:", uploadId);

    const chunkSize = 5 * 1024 * 1024; // 5 MB chunks
    const chunks = Math.ceil(file.length / chunkSize);
    const parts = [];

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.length);

      const uploadPartParams = {
        Bucket: bucket,
        Key: key,
        PartNumber: i + 1,
        UploadId: uploadId,
        Body: file.slice(start, end),
      };

      const partResponse = await s3Client.send(new UploadPartCommand(uploadPartParams));
      parts.push({ ETag: partResponse.ETag, PartNumber: i + 1 });
    }

    // Complete multipart upload
    const completeMultipartUploadParams = {
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    const completeResponse = await s3Client.send(new CompleteMultipartUploadCommand(completeMultipartUploadParams));
    console.log("Upload completed successfully!");
    return `https://${bucket}.s3.${REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error generating S3 URL:", error);
    throw error;
  }
};


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
      console.log("Request received:", req.body);
      const { title, description, status, playlist } = req.body;

      let thumbnailURL = null;
      let videoURL = null;
      let notesURL = null;

      if (req.files.thumbnail) {
        const fileName = `${Date.now()}-${req.files.thumbnail[0].originalname}`;
        const key = `uploads/courseThumbnails/${fileName}`;
        thumbnailURL = await multipartUpload(BUCKET_NAME, key, req.files.thumbnail[0].buffer);
      }

      if (req.files.video) {
        const fileName = `${Date.now()}-${req.files.video[0].originalname}`;
        const key = `uploads/courseVideos/${fileName}`;
        videoURL = await multipartUpload(BUCKET_NAME, key, req.files.video[0].buffer);
      }

      if (req.files.notes) {
        const fileName = `${Date.now()}-${req.files.notes[0].originalname}`;
        const key = `uploads/courseNotes/${fileName}`;
        notesURL = await multipartUpload(BUCKET_NAME, key, req.files.notes[0].buffer);
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
