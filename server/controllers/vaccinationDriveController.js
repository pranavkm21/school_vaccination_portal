const pool = require('../config/db');

// Get all vaccination drives
const getVaccinationDrives = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vaccination_drives');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a vaccination drive
const createVaccinationDrive = async (req, res) => {
  const { vaccine_name, drive_date, doses_available, applicable_classes } = req.body;

  // Ensure applicable_classes is an array if it is passed as a string (i.e., ['Class A', 'Class B'])
  const classesArray = Array.isArray(applicable_classes) ? applicable_classes : [applicable_classes];

  try {
    const newDrive = await pool.query(
      'INSERT INTO vaccination_drives (vaccine_name, drive_date, doses_available, applicable_classes) VALUES ($1, $2, $3, $4) RETURNING *',
      [vaccine_name, drive_date, doses_available, classesArray]
    );
    res.json(newDrive.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a vaccination drive
const updateVaccinationDrive = async (req, res) => {
  const { id } = req.params;
  const { vaccine_name, drive_date, doses_available, applicable_classes } = req.body;

  // Ensure applicable_classes is an array if it is passed as a string
  const classesArray = Array.isArray(applicable_classes) ? applicable_classes : [applicable_classes];

  try {
    const updatedDrive = await pool.query(
      'UPDATE vaccination_drives SET vaccine_name = $1, drive_date = $2, doses_available = $3, applicable_classes = $4 WHERE id = $5 RETURNING *',
      [vaccine_name, drive_date, doses_available, classesArray, id]
    );
    res.json(updatedDrive.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a vaccination drive
const deleteVaccinationDrive = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM vaccination_drives WHERE id = $1', [id]);
    res.send('Vaccination drive deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getVaccinationDrives,
  createVaccinationDrive,
  updateVaccinationDrive,
  deleteVaccinationDrive,
};