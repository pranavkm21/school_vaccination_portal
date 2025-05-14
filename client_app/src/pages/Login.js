import React, { useState } from 'react';
import LoginPageImage from '/Users/pranav.kanagal/Documents/VaxSure_School_Vaccination_Portal/client_app/src/images/LoginPageImage.png';

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [openError, setOpenError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setOpenError(true); // Show Snackbar on error
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url(${LoginPageImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${LoginPageImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            zIndex: 0,
          },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 6,
            maxWidth: 400,
            width: '100%',
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(5px)',
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              School Vaccination Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please login to continue
            </Typography>
          </Box>

          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              mt: 3,
              py: 1.4,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #1976d2, #42a5f5)',
            }}
          >
            Login
          </Button>
        </Paper>
      </Box>

      {/* Snackbar for error */}
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpenError(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          Invalid username or password.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;