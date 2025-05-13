const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const vaccinationDriveController = require('../controllers/vaccinationDriveController');

// Get all vaccination drives
router.get('/', vaccinationDriveController.getVaccinationDrives);

// Create a new vaccination drive
router.post('/', vaccinationDriveController.createVaccinationDrive);

// Update a vaccination drive's details
router.put('/:id', vaccinationDriveController.updateVaccinationDrive);

// Delete a vaccination drive
router.delete('/:id', vaccinationDriveController.deleteVaccinationDrive);

// Get upcoming vaccination drives
router.get('/upcoming', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vaccination_drives WHERE drive_date > CURRENT_DATE ORDER BY drive_date ASC;"
    );
    res.json({ upcomingVaccinationDrives: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;