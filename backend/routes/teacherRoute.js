const express = require('express');
const Teacher = require('../models/admin');

const router = express.Router();

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error });
  }
});

// Add a new teacher
router.post('/teachers', async (req, res) => {
  const { name, profession, email, image } = req.body;
  try {
    const newTeacher = new Teacher({ name, profession, email, image });
    await newTeacher.save();
    res.status(201).json({ message: 'Teacher added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding teacher', error });
  }
});

module.exports = router;
