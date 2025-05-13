const pool = require('../config/db');

// POST: Filtered report based on vaccine name
const generateVaccinationReport = async (req, res) => {
  const { vaccine_name } = req.body;

  try {
    const query = vaccine_name
      ? 'SELECT * FROM vaccination_records WHERE vaccine_name = $1'
      : 'SELECT * FROM vaccination_records';

    const result = await pool.query(query, vaccine_name ? [vaccine_name] : []);
    res.json(result.rows);
  } catch (err) {
    console.error('Error generating report:', err.message);
    res.status(500).send('Server Error');
  }
};

// GET: Return all vaccination reports
const getAllReports = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vaccination_records');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  generateVaccinationReport,
  getAllReports,
};