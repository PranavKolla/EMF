import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Button, Container, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { Search as SearchIcon, AccountCircle } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import './css/Home.css';

function Home() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub || 'User');
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const handleExploreClick = () => {
    navigate('/events');
  };

  const handleUsernameClick = async () => {
    setIsDialogOpen(true);
    setLoadingDetails(true);
    setUserDetails(null);
    setErrorDetails('');

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:9090/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch user details: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      setUserDetails(data);
      setLoadingDetails(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setErrorDetails(error.message);
      setLoadingDetails(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setUserDetails(null);
    setErrorDetails('');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const handleBookingHistoryClick = () => {
    navigate('/bookings'); // Navigate to the Booking Dashboard route
  };

  return (
    <div className="root">
      <AppBar position="static" className="appBar">
        <Toolbar>
          <Typography variant="h6" className="title">
            <div>
              <Button color="inherit" onClick={handleBookingHistoryClick}>
                Booking History
              </Button>
              &nbsp;&nbsp;
              Feed Back
            </div>
          </Typography>
          <IconButton edge="end" color="inherit" className="username-button" onClick={handleUsernameClick}>
            <AccountCircle />
            &nbsp; {username}
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className="centered-container">
        <Container className="searchBarContainer">
          <InputBase
            placeholder="Hinted search text"
            className="searchInputBase"
            startAdornment={<SearchIcon />}
          />
        </Container>

        <Container className="mainContentContainer">
          <Typography variant="h4" align="center">
            THE LAND OF EVENTS
          </Typography>
          <Typography variant="subtitle1" align="center">
            SMALL DESCRIPTION ABOUT SITE
          </Typography>
          <Button variant="contained" color="primary" className="exploreButton" onClick={handleExploreClick}>
            Explore
          </Button>
        </Container>
      </div>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {loadingDetails && <CircularProgress />}
          {errorDetails && <Typography color="error">{errorDetails}</Typography>}
          {userDetails && (
            <div>
              <Typography>User ID: {userDetails.userid || userId}</Typography>
              <Typography>Username: {userDetails.username || username}</Typography>
              <Typography>Contact Number: {userDetails.contactNumber}</Typography>
              <Typography>Email: {userDetails.email}</Typography>
              {/* <Typography>API Endpoint: /users/{userId}</Typography> */}
            </div>
          )}
          {!loadingDetails && !userDetails && !errorDetails && (
            <Typography>Fetching user details...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
          <Button onClick={handleDialogClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;