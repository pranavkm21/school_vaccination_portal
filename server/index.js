const express = require('express');
const cors = require('cors');
const pool = require('./config/db');  // Database connection

// Import route files
const studentRoutes = require('./routes/studentRoutes');
const vaccinationDriveRoutes = require('./routes/vaccinationDriveRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes')

const app = express();
app.use(cors());
app.use(express.json());  // To parse JSON bodies

const PORT = 8080;

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the School Vaccination Portal API');
});

// Route groups
app.use('/api/students', studentRoutes); // All student-related routes
app.use('/api/vaccinationDrive', vaccinationDriveRoutes); // Vaccination drive routes
app.use('/api/reports', reportRoutes); // Report-related routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/register', registerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
