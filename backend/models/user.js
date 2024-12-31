const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  name: String,
  role: String,
  profession: String,
  email: String,
  password: String,
  profileImage: String,
});

const User = mongoose.model("User", RegisterSchema);
module.exports = User;
