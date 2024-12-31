const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// POST route to handle form submissions
router.post('/contact', async (req, res) => {
  const { name, email, mobile_number, message } = req.body;
  console.log(req.body.name,1122);
  try {
    // Validate the data (basic validation example)
    if (!name || !email || !mobile_number || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Save contact details to the database
    const newContact = new Contact({
      name,
      email,
      mobile_number,
      message,
    });
    console.log(newContact,111)
    const savedContact = await newContact.save();
    res.status(201).json({
      message: 'Your message has been submitted successfully!',
      contact: savedContact,
    });
  } catch (error) {
    console.error('Error while submitting contact form:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});

// GET route to fetch all contact messages (for admin use)
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});

module.exports = router;
