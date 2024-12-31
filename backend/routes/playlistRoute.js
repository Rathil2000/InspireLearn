const express = require("express");
const multer = require("multer");
const path = require("path");
const Playlist = require("../models/playlist");
const app = express();
const router = express.Router();
const Favorite = require("../models/favorite");
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + path.extname(file.originalname); // Add unique suffix to filename

    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));

// Route: Create a new playlist
router.post("/playlist", upload.single("thumbnail"), async (req, res) => {
  try {
    const { status, title, description } = req.body;
    const thumbnail = req.file ? req.file.path : null;

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
    playlists.map((playlist) => {
     
    });
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
    try {
      // Update playlist logic
      const updateData = { status, title, description };
      if (req.file) {
        updateData.thumbnail = req.file.path; // Update thumbnail if provided
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
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating playlist", error });
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
