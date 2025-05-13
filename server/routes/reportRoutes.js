const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// POST route with optional vaccine filter
router.post('/', reportController.generateVaccinationReport);

// GET route to fetch all reports
router.get('/', reportController.getAllReports);

module.exports = router;