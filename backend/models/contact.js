const mongoose = require('mongoose');

// Contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50,
  },
  mobile_number: {
    type: String,
    required: true,
    maxLength: 15,
  },
  message: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Contact', contactSchema);
