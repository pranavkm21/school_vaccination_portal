const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const pool = require('../config/db');  // Assuming you have a db connection file

// Get all students
router.get('/', studentController.getStudents);

// Create a new student
router.post('/', studentController.createStudent);

// Update a student's details
router.put('/:id', studentController.updateStudent);

// Delete a student
router.delete('/:id', studentController.deleteStudent);

// Get total number of students
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM students');
    res.json({ totalStudents: result.rows[0].count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get vaccinated student count
router.get('/vaccinated/count', async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM students WHERE vaccinated = 'Yes'");
    res.json({ vaccinatedStudents: result.rows[0].count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;