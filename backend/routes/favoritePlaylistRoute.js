const express = require("express");
const Playlist = require("../models/playlist");
const app = express();
const router = express.Router();
const Favorite = require("../models/favorite");



// Route: Get all favorite playlists
router.get("/favorite-playlist", async (req, res) => {
    try {
      // Fetch all favorite playlist references
      const favoritePlaylists = await Favorite.find();
      const favoritePlaylistIds = favoritePlaylists.map((favorite) => favorite.playlistId);
  
      // Fetch playlists that exist in the favorite list
      const playlists = await Playlist.find({ _id: { $in: favoritePlaylistIds } });
  
  
      playlists.forEach((playlist) => {
      });
  
      res.status(200).json(playlists);
    } catch (error) {
      console.error("Error fetching favorite playlists:", error);
      res.status(500).json({ error: "Failed to fetch favorite playlists" });
    }
  });
// Add playlist to favorites
router.post("/favorites", async (req, res) => {
    const { userId, playlistId } = req.body;
  
    try {
      const favorite = new Favorite({ userId, playlistId });
      await favorite.save();
      res.status(200).json({ message: "Playlist added to favorites!" });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ error: "Failed to add to favorites" });
    }
  });
  
  // Delete a favorite playlist by playlist ID
router.delete("/favorite-playlist/:playlistId", async (req, res) => {
    try {
      const playlistId = req.params.playlistId;
  
      // Find and delete the entry with the given playlistId in the FavoritePlaylist table
      const deletedFavorite = await Favorite.findOneAndDelete({ playlistId });
      if (!deletedFavorite) {
        return res.status(404).send({ message: "Favorite playlist not found" });
      }
  
      res.status(200).send({ message: "Playlist removed from favorites successfully" });
    } catch (err) {
      console.error("Error removing favorite playlist:", err);
      res.status(500).send({ message: "Error removing favorite playlist" });
    }
  });
  

module.exports = router;