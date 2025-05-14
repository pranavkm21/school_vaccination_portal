import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Reports() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const vaccineOptions = ['Covaxin', 'Sputnik', 'Covishield', 'Pfizer', 'Moderna'];

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reports');
      setData(response.data);
      setFilteredData(response.data);
    } catch (err) {
      console.error('Failed to fetch report data:', err);
    }
  };

  const fetchFilteredReports = async (vaccineName) => {
    try {
      const response = await axios.post('http://localhost:8080/api/reports', {
        vaccine_name: vaccineName,
      });
      setFilteredData(response.data);
    } catch (err) {
      console.error('Failed to fetch filtered report data:', err);
    }
  };

  const handleFilterChange = async (e) => {
    const selected = e.target.value;
    setSelectedVaccine(selected);

    if (selected === '') {
      setFilteredData(data);
    } else {
      await fetchFilteredReports(selected);
    }

    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'vaccination_report.csv');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'vaccination_report.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Vaccination Report', 14, 16);
    const tableData = filteredData.map((row) => [
      row.student_id,
      row.student_name,
      row.student_class,
      row.status,
      new Date(row.vaccinated_on).toLocaleDateString(),
      row.vaccine_name,
    ]);

    doc.autoTable({
      startY: 20,
      head: [['Student ID', 'Name', 'Class', 'Status', 'Date', 'Vaccine']],
      body: tableData,
    });

    doc.save('vaccination_report.pdf');
  };

  return (
    <Box display="flex" height="100vh">
      <Sidebar />
      <Box p={4} flexGrow={1} width="100%">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Vaccination Reports
        </Typography>

        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <TextField
            select
            label="Filter by Vaccine"
            value={selectedVaccine}
            onChange={handleFilterChange}
            fullWidth
            size="small"
          >
            <MenuItem value="">All Vaccines</MenuItem>
            {vaccineOptions.map((vaccine, index) => (
              <MenuItem key={index} value={vaccine}>
                {vaccine}
              </MenuItem>
            ))}
          </TextField>
        </Paper>

        <Paper elevation={3} sx={{ width: '100%', overflow: 'auto' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Vaccination Date</strong></TableCell>
                  <TableCell><strong>Vaccine Name</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.student_id}>
                      <TableCell>{row.student_id}</TableCell>
                      <TableCell>{row.student_name}</TableCell>
                      <TableCell>{row.student_class}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{new Date(row.vaccinated_on).toLocaleDateString()}</TableCell>
                      <TableCell>{row.vaccine_name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" startIcon={<Download />} onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={exportToPDF}>
            Export PDF
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Reports;