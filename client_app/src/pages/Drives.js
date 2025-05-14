import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const VaccinationDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('drive_date');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editDrive, setEditDrive] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newDrive, setNewDrive] = useState({
    vaccine_name: '',
    drive_date: '',
    doses_available: '',
    applicable_classes: '',
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDriveForDelete, setSelectedDriveForDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Added for consistent snackbar

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/vaccinationDrive/upcoming');
        setDrives(response.data.upcomingVaccinationDrives);
      } catch (err) {
        console.error('Error fetching drives:', err);
        setError('Failed to load vaccination drives.');
        setSnackbarMessage('Failed to load vaccination drives.'); // Set message
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleEditClick = (drive) => {
    setEditDrive(drive);
    setOpenEditDialog(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/vaccinationDrive/${editDrive.id}`, editDrive);
      setDrives((prevDrives) =>
        prevDrives.map((drive) => (drive.id === editDrive.id ? editDrive : drive))
      );
      setSnackbarMessage('Drive updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error saving edit:', error);
      setSnackbarMessage('Failed to update drive.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAddClick = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/vaccinationDrive', newDrive);
      setDrives((prevDrives) => [...prevDrives, response.data]);
      setSnackbarMessage('Drive added successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenAddDialog(false);
      setNewDrive({        //reset the form
        vaccine_name: '',
        drive_date: '',
        doses_available: '',
        applicable_classes: '',
      });
    } catch (error) {
      console.error('Error adding new drive:', error);
      setSnackbarMessage('Failed to add drive.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewDrive((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDrive((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setOpenAddDialog(false);
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = (drive) => {
    setSelectedDriveForDelete(drive);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/vaccinationDrive/${selectedDriveForDelete.id}`);
      setDrives((prevDrives) => prevDrives.filter((d) => d.id !== selectedDriveForDelete.id));
      setSnackbarMessage('Drive deleted successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting drive:', error);
      setSnackbarMessage('Failed to delete drive.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ backgroundColor: '#d5e9fb' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ backgroundColor: '#d5e9fb' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const sortedDrives = drives.sort((a, b) => {
    if (sortDirection === 'asc') {
      return dayjs(a[sortBy]).isBefore(dayjs(b[sortBy])) ? -1 : 1;
    } else {
      return dayjs(a[sortBy]).isBefore(dayjs(b[sortBy])) ? 1 : -1;
    }
  });

  return (
    <Box display="flex" height="100vh" sx={{ backgroundColor: '#d5e9fb' }}>
      <Sidebar />
      <Box flex={1} p={4} sx={{ backgroundColor: '#d5e9fb', overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2C3E50' }}>
          Vaccination Drives
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
          sx={{ marginBottom: 2 }}
        >
          Add New Drive
        </Button>
        <TableContainer component={Paper} elevation={3} sx={{ backgroundColor: '#f1f1f1' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#b3e5fc' }}>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'id'}
                    direction={sortDirection}
                    onClick={() => handleSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'vaccine_name'}
                    direction={sortDirection}
                    onClick={() => handleSort('vaccine_name')}
                  >
                    Vaccine Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'drive_date'}
                    direction={sortDirection}
                    onClick={() => handleSort('drive_date')}
                  >
                    Drive Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>Doses Available</TableCell>
                <TableCell>Applicable Classes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDrives.map((drive) => (
                <TableRow key={drive.id} sx={{ backgroundColor: '#f1f1f1' }}>
                  <TableCell>{drive.id}</TableCell>
                  <TableCell>{drive.vaccine_name}</TableCell>
                  <TableCell>{dayjs(drive.drive_date).format('DD MMM YYYY')}</TableCell>
                  <TableCell>{drive.doses_available}</TableCell>
                  <TableCell>
                    {drive.applicable_classes.map((cls, index) => (
                      <Chip
                        key={index}
                        label={cls}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5, backgroundColor: '#e0f7fa', color: '#2c3e50' }} //styled chip
                        variant="outlined"
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(drive)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(drive)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseDialog}>
          <DialogTitle sx={{ color: '#2C3E50' }}>Edit Vaccination Drive</DialogTitle>
          <DialogContent>
            <TextField
              label="Vaccine Name"
              fullWidth
              value={editDrive?.vaccine_name || ''}
              onChange={handleEditChange}
              name="vaccine_name"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            <TextField
              label="Drive Date"
              type="date"
              name="drive_date"
              fullWidth
              value={editDrive?.drive_date?.slice(0, 10) || ''}
              onChange={handleEditChange}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Doses Available"
              fullWidth
              value={editDrive?.doses_available || ''}
              onChange={handleEditChange}
              name="doses_available"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Applicable Classes"
              fullWidth
              value={editDrive?.applicable_classes?.join(', ') || ''}
              onChange={(e) => {
                const classes = e.target.value.split(',').map(s => s.trim());
                handleEditChange({ target: { name: 'applicable_classes', value: classes } });
              }}
              name="applicable_classes"
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add New Drive Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseDialog}>
          <DialogTitle sx={{ color: '#2C3E50' }}>Add New Vaccination Drive</DialogTitle>
          <DialogContent>
            <TextField
              label="Vaccine Name"
              fullWidth
              value={newDrive.vaccine_name}
              onChange={handleAddChange}
              name="vaccine_name"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            <TextField
              label="Drive Date"
              type="date"
              name="drive_date"
              fullWidth
              value={newDrive.drive_date}
              onChange={handleAddChange}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Doses Available"
              fullWidth
              value={newDrive.doses_available}
              onChange={handleAddChange}
              name="doses_available"
              sx={{ marginBottom: 2 }}
            />
             <TextField
              label="Applicable Classes (Comma-separated)"
              fullWidth
              value={newDrive.applicable_classes}
              onChange={handleAddChange}
              name="applicable_classes"
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddClick} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
          <DialogTitle sx={{ color: '#2C3E50' }}>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#757575' }}>Are you sure you want to delete this drive?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Success/Error Messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default VaccinationDrivesPage;