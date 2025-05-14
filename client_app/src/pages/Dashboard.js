import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import EventIcon from '@mui/icons-material/Event';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [vaccinatedCount, setVaccinatedCount] = useState(0);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [editableRows, setEditableRows] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetch('http://localhost:8080/api/students/count')
      .then((res) => res.json())
      .then((data) => setStudentCount(data.totalStudents));

    fetch('http://localhost:8080/api/students/vaccinated/count')
      .then((res) => res.json())
      .then((data) => setVaccinatedCount(data.vaccinatedStudents));

    fetch('http://localhost:8080/api/vaccinationDrive/upcoming')
      .then((res) => res.json())
      .then((data) => setUpcomingDrives(data.upcomingVaccinationDrives));

    fetchRegisteredStudents();
  }, []);

  const fetchRegisteredStudents = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/register');
      setRegisteredStudents(res.data);
    } catch (err) {
      console.error('Error fetching registered students:', err);
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditableRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
    try {
      const updatedData = editableRows[id];
      await axios.put(`http://localhost:8080/api/register/${id}`, {
        student_id: id,
        name: updatedData.name,
        class: updatedData.class,
        vaccine_name: updatedData.vaccine_name,
        vacc_drive_date: updatedData.vacc_drive_date,
      });
      setSnackbar({ open: true, message: 'Student registration updated', severity: 'success' });
      fetchRegisteredStudents();
      setEditableRows((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } catch (err) {
      console.error('Error updating registration:', err);
      setSnackbar({ open: true, message: 'Failed to update registration', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box display="flex" height="100vh" sx={{ backgroundColor: '#d5e9fb' }}>
      <Sidebar />
      <Box flex={1} p={4} sx={{ backgroundColor: '#d5e9fb', overflowY: 'auto' }}>
        <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: '#a2d2ff', width: 56, height: 56 }}>
              <SchoolIcon fontSize="large" sx={{ color: '#2C3E50' }} />
            </Avatar>
            <Box ml={2}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C3E50' }}>Welcome Back!</Typography>
              <Typography variant="subtitle1" color="text.secondary">Here is your school health snapshot</Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#f1f8e9' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon sx={{ fontSize: 40, mr: 2, color: '#4caf50' }} />
                <Box>
                  <Typography variant="h6" sx={{ color: '#2C3E50' }}>Total Students</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#4caf50' }}>{studentCount}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#e8f5e9' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <VaccinesIcon sx={{ fontSize: 40, mr: 2, color: '#00bcd4' }} />
                <Box>
                  <Typography variant="h6" sx={{ color: '#2C3E50' }}>Vaccinated Students</Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#00bcd4' }}>{vaccinatedCount}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#f1f1f1' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <EventIcon sx={{ fontSize: 40, mr: 2, color: '#fb8c00' }} />
                <Typography variant="h6" sx={{ color: '#2C3E50' }}>Upcoming Vaccination Drives</Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <List dense>
                {upcomingDrives.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No upcoming drives" />
                  </ListItem>
                ) : (
                  upcomingDrives.map((drive) => (
                    <ListItem key={drive.id}>
                      <ListItemText
                        primary={`${new Date(drive.drive_date).toLocaleDateString()} | ${drive.vaccine_name} | No of Slots: ${drive.doses_available} | Applicable Classes: ${drive.applicable_classes}`}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#2C3E50' }}>
            Registered Students
          </Typography>
          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: '#b3e5fc' }}>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Student ID</strong></TableCell>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell><strong>Vaccine Name</strong></TableCell>
                  <TableCell><strong>Drive Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registeredStudents.map((student) => {
                  const isEditing = editableRows[student.student_id];
                  return (
                    <TableRow key={student.student_id} sx={{ backgroundColor: '#f1f1f1' }}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.student_id}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.vaccine_name}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            type="date"
                            value={
                              editableRows[student.student_id]?.vacc_drive_date?.slice(0, 10) ||
                              student.vacc_drive_date.slice(0, 10)
                            }
                            onChange={(e) =>
                              handleEditChange(student.student_id, 'vacc_drive_date', e.target.value)
                            }
                            size="small"
                          />
                        ) : (
                          new Date(student.vacc_drive_date).toLocaleDateString()
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <IconButton onClick={() => handleSave(student.student_id)} color="primary">
                            <SaveIcon />
                          </IconButton>
                        ) : (
                          <Button
                            size="small"
                            onClick={() =>
                              setEditableRows((prev) => ({
                                ...prev,
                                [student.student_id]: { ...student },
                              }))
                            }
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Dashboard;