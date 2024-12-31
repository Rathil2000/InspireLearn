const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  id: {type: Number,primaryKey: true,autoIncrement: true,},
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String }, // Path to uploaded file
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
