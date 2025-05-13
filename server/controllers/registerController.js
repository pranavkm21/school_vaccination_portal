const pool = require('../config/db');

const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM register_students ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
};

const registerStudent = async (req, res) => {
  const { name, student_id, class: studentClass, vaccine_name, vacc_drive_date } = req.body;
  try {
    const result = await pool.query(
      `
        INSERT INTO register_students (student_id, name, class, vaccine_name, vacc_drive_date)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (student_id)
        DO UPDATE SET name = EXCLUDED.name, class = EXCLUDED.class, vaccine_name = EXCLUDED.vaccine_name, vacc_drive_date = EXCLUDED.vacc_drive_date
      `,
      [student_id, name, studentClass, vaccine_name, vacc_drive_date]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registering student:', err);
    res.status(500).json({ error: 'Failed to register student' });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM register_students WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

module.exports = {
  getAllStudents,
  registerStudent,
  deleteStudent,
};