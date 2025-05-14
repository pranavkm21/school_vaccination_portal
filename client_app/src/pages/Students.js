import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Alert from '@mui/material/Alert';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    student_id: '',
    class: '',
    age: '',
    gender: '',
    vaccinated: '',
  });
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);  // New state for delete confirmation
  const [studentToDelete, setStudentToDelete] = useState(null);  // Store student to delete
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchVaccinationDrives();
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/register');
      setRegistrations(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchVaccinationDrives = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/vaccinationDrive/upcoming');
      setDrives(res.data.upcomingVaccinationDrives);
    } catch (err) {
      console.error('Error fetching vaccination drives:', err);
    }
  };

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async () => {
    try {
      await axios.post('http://localhost:8080/api/students', newStudent);
      fetchStudents();
      setOpen(false);
      setNewStudent({
        name: '',
        student_id: '',
        class: '',
        age: '',
        gender: '',
        vaccinated: '',
      });
    } catch (err) {
      console.error('Error adding student:', err);
    }
  };

  const handleRegisterClick = (student) => {
    setSelectedStudent(student);
    setOpenRegisterDialog(true);
  };

  const handleRegister = async () => {
    if (!selectedDrive) {
      setSnackbarMessage('Please select a vaccination drive');
      setSnackbarOpen(true);
      return;
    }

    try {
      const selectedVaccDrive = drives.find((drive) => drive.id.toString() === selectedDrive.toString());
      console.log(selectedVaccDrive);
      console.log(selectedDrive);

      // If no matching drive is found, display an error
      if (!selectedVaccDrive) {
        setSnackbarMessage('Selected drive not found');
        setSnackbarOpen(true);
        return;
      }

      // Proceed to register the student to the selected drive
      await axios.post('http://localhost:8080/api/register', {
        name: selectedStudent.name,
        student_id: selectedStudent.student_id,
        driveId: selectedDrive,
        class: selectedStudent.class,
        vaccine_name: selectedVaccDrive.vaccine_name,
        vacc_drive_date: selectedVaccDrive.drive_date, 
      });

      setSnackbarMessage('Student successfully registered to the drive');
      setSnackbarOpen(true);
      setOpenRegisterDialog(false);  // Close the dialog after successful registration
      fetchStudents(); // refresh student data
      window.location.reload();
    } catch (err) {
      setSnackbarMessage('Error registering student');
      setSnackbarOpen(true);
      console.error('Error registering student:', err);
    }
  };

  const handleUpdate = (student) => {
    setNewStudent(student);
    setOpen(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/students/${studentToDelete.id}`);
      setSnackbarMessage('Student successfully deleted');
      setSnackbarOpen(true);
      fetchStudents(); // refresh student data
      setOpenDeleteDialog(false);  // Close the dialog after deletion
    } catch (err) {
      setSnackbarMessage('Error deleting student');
      setSnackbarOpen(true);
      console.error('Error deleting student:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box display="flex" height="100vh">
      <Sidebar />
      <Box sx={{ p: 4 }} flex={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Student Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Student
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e0f7fa' }}>
              <TableRow style={{ textAlign: 'center' }}>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Student ID</strong></TableCell>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Age</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell ><strong>Covid19 Vaccinated ?</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow style={{ textAlign: 'center' }} key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.student_id}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{student.vaccinated}</TableCell>
                  <TableCell>
                    <Button size="small" color="error" onClick={() => handleDeleteClick(student)}>
                      Delete
                    </Button>
                    <Button size="small" color="secondary" onClick={() => handleUpdate(student)}>
                      Update
                    </Button>
                    {student.vaccinated === 'No' && (
                      <Button
                        size="small"
                        color="primary"
                        disabled={registrations.some((reg) => reg.student_id === student.student_id)}
                        onClick={() => handleRegisterClick(student)}
                      >
                        {registrations.some((reg) => reg.student_id === student.student_id)
                          ? 'Registered'
                          : 'Register'}
                      </Button>
                    )}

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Student Modal */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{newStudent.id ? 'Update Student' : 'Add New Student'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="dense"
              value={newStudent.name}
              onChange={handleChange}
            />
            <TextField
              label="Student ID"
              name="student_id"
              fullWidth
              margin="dense"
              value={newStudent.student_id}
              onChange={handleChange}
            />
            <TextField
              label="Class"
              name="class"
              fullWidth
              margin="dense"
              value={newStudent.class}
              onChange={handleChange}
            />
            <TextField
              label="Age"
              name="age"
              fullWidth
              margin="dense"
              value={newStudent.age}
              onChange={handleChange}
            />
            <TextField
              label="Gender"
              name="gender"
              fullWidth
              margin="dense"
              value={newStudent.gender}
              onChange={handleChange}
            />
            <TextField
              label="Covid19 Vaccinated ?"
              name="vaccinated"
              fullWidth
              margin="dense"
              value={newStudent.vaccinated}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudent} variant="contained">
              {newStudent.id ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Register Vaccination Drive Dialog */}
        <Dialog
          open={openRegisterDialog}
          onClose={() => setOpenRegisterDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Register Student to Vaccination Drive</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Select Vaccination Drive"
              fullWidth
              margin="dense"
              value={selectedDrive}
              onChange={(e) => setSelectedDrive(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value=""></option>
              {drives.length > 0 ? (
                drives.map((drive) => (
                  <option key={drive.id} value={drive.id}>
                    {drive.vaccine_name} - {new Date(drive.drive_date).toLocaleDateString()}
                  </option>
                ))
              ) : (
                <option value="" disabled>No available drives</option>
              )}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleRegister}
              variant="contained"
              disabled={
                selectedStudent &&
                registrations.some(
                  (reg) => reg.student_id === selectedStudent.student_id
                )
              }
            >
              {selectedStudent &&
                registrations.some(
                  (reg) => reg.student_id === selectedStudent.student_id
                )
                ? 'Registered'
                : 'Register'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this student?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Students;