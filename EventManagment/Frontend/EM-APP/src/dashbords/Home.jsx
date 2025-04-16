import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Button, Container } from '@mui/material';
import { Search as SearchIcon, AccountCircle } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './css/Home.css'; // Import your CSS file

function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub || 'User');
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const handleExploreClick = () => {
    navigate('/events'); // Navigate to the EventDashboard route
  };

  return (
    <div className="root">
      <AppBar position="static" className="appBar">
        <Toolbar>
          <Typography variant="h6" className="title">
            <div>
              Booking History
              &nbsp;&nbsp;
              Feed Back
            </div>
          </Typography>
          <IconButton edge="end" color="inherit" className="username-button">
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
    </div>
  );
}

export default Home;