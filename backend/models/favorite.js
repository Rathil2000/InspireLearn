const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: String,
  playlistId: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist" },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
