const pool = require('../config/db');

// Get all students
const getStudents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching students:', err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new student
const createStudent = async (req, res) => {
  const { name, student_id, class: studentClass, age, gender, vaccinated } = req.body; // Rename class to studentClass

  try {
    const newStudent = await pool.query(
      'INSERT INTO students (name, student_id, class, age, gender, vaccinated) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, student_id, studentClass, age, gender, vaccinated] // Pass variables correctly
    );
    res.json(newStudent.rows[0]);
  } catch (err) {
    console.error('Error creating student:', err.message);
    res.status(500).send('Server Error');
  }
};

// Update a student's details
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, student_id, class: studentClass, age, gender, vaccinated } = req.body; // Rename class to studentClass

  try {
    const updatedStudent = await pool.query(
      'UPDATE students SET name = $1, student_id = $2, class = $3, age = $4, gender = $5, vaccinated = $6 WHERE id = $7 RETURNING *',
      [name, student_id, studentClass, age, gender, vaccinated, id] // Pass variables correctly
    );
    res.json(updatedStudent.rows[0]);
  } catch (err) {
    console.error('Error updating student:', err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    res.send('Student deleted');
  } catch (err) {
    console.error('Error deleting student:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};
