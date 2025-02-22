const express = require("express");
const { s3Client, getObjectURL, upload } = require("../utils/awsS3Utils"); // Import utilities
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const Playlist = require("../models/playlist");
const app = express();
const router = express.Router();
const Favorite = require("../models/favorite");

// AWS S3 bucket name
const BUCKET_NAME = "inspirelearn-files-upload";

// Route: Create a new playlist
router.post("/playlist", upload.single("thumbnail"), async (req, res) => {
  try {
    const { status, title, description } = req.body;
    console.log("Received data:", req.body); // Log received data
    let thumbnail = null;

    if (req.file) {
      // Log the uploaded file
      console.log("Received file:", req.file);
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `uploads/playlistThumbnails/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      // Log upload parameters
      console.log("Uploading to S3 with params:", uploadParams);

      try {
        const s3Response=await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("S3 Response:", s3Response);
        thumbnail = await getObjectURL(
          `uploads/playlistThumbnails/${fileName}`
        );
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        return res.status(500).json({ error: `Failed to upload thumbnail. ${error.message}`});
      }
    }
    const newPlaylist = new Playlist({ status, title, description, thumbnail });
    await newPlaylist.save();

    res.status(201).json({ message: "Playlist created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create playlist." });
  }
});

// Route: Get all playlists
router.get("/playlist", async (req, res) => {
  try {
    const playlists = await Playlist.find();

    // Using map to access thumbnails
    playlists.map((playlist) => {});
    res.status(200).json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// Update a playlist
router.put("/playlists/:id", upload.single("thumbnail"), async (req, res) => {
  const { id } = req.params;
  const { status, title, description } = req.body;
  try {
    const updateData = { status, title, description };
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `uploads/playlistThumbnails/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      updateData.thumbnail = await getObjectURL(
        `uploads/playlistThumbnails/${fileName}`
      );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({ message: "Error updating playlist." });
  }
});
// Delete a playlist
router.delete("/playlists/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Delete the playlist directly using .deleteOne()
    const result = await Playlist.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json({ message: "Playlist deleted successfully!" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ message: "Error deleting playlist", error });
  }
});
module.exports = router;
