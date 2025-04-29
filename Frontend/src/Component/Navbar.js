import React, { useEffect, useState, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, Snackbar, IconButton, Alert, Menu, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onSignOut }) => {
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Guest';
    setName(storedUsername);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignOut = useCallback(async () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    try {
      await axios.post(`${apiBaseUrl}/api/auth/logout`);
      ['access_token', 'refresh_token', 'expiration_time', 'username'].forEach((key) => localStorage.removeItem(key));
      onSignOut();
      navigate('/login');
    } catch {
      setError('Failed to log out. Please try again.');
    }
  }, [navigate, onSignOut]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isMenuOpen = Boolean(anchorEl);

  return (
    <>
      <AppBar position="static"
        sx={{
          backgroundColor: '#1976D2', // Changed background color to a more vibrant blue
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' // Increased box shadow intensity for depth
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: 1 // Added letter spacing for better readability
            }}
          >
            My Application
          </Typography>
          {isAuthenticated && (
            <>
              <Button
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  '&:hover': { backgroundColor: '#0D47A1' },
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: 4,
                  transition: 'background-color 0.3s',
                }}
              >
                <AccountCircleIcon sx={{ marginRight: 1 }} />
                {name}
              </Button>
              <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                <MenuItem
                  onClick={handleSignOut}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#E57373',
                      color: '#fff',
                    },
                    color: '#D32F2F',
                  }}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={5000} onClose={() => setError(null)}>
          <Alert
            onClose={() => setError(null)}
            severity="error"
            action={
              <IconButton size="small" onClick={() => setError(null)}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ width: '100%', position: 'absolute', top: 0, right: 0 }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Navbar;
