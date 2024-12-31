const mongoose = require("mongoose");
const Playlist = require("../models/playlist");
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    playlist: {  type: String, },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
    thumbnail: {
      type: String,
    },
    video: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("course", courseSchema);
module.exports = Course;
