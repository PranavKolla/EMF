import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Button, Container, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, List, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon } from '@mui/material';
import { Search as SearchIcon, AccountCircle, Notifications as NotificationsIcon, Close as CloseIcon } from '@mui/icons-material';
import { Badge } from '@mui/material';
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
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState('');

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

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    setErrorNotifications('');
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:9090/notifications/usernotify/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch notifications: ${response.status} - ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      setNotifications(data);
      setLoadingNotifications(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setErrorNotifications(error.message);
      setLoadingNotifications(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    console.log('Deleting notification with ID:', notificationId);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(
        `http://localhost:9090/notifications/deletenotify/${notificationId}`,
        {
          method: 'PUT', // Changed to PUT as per your code
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to delete notification: ${response.status}`;
        try {
          const errorText = await response.text(); // Try to get the error message as text
          errorMessage += ` - ${errorText}`;
        } catch (textError) {
          console.error("Failed to parse error text:", textError);
          errorMessage += ` - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // If the response is successful (response.ok is true),
      // we don't necessarily need to parse JSON.
      // We can just assume success and refresh the notifications.
      console.log('Notification deleted successfully (no JSON expected)');
      fetchNotifications();

    } catch (error) {
      console.error('Error deleting notification:', error);
      // Optionally, show an error message to the user
    }
  };

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

  const handleFeedbackClick = () => {
    navigate('/feedback'); // Navigate to the Feedback Dashboard route
  };

  const toggleNotificationDrawer = () => {
    setIsNotificationOpen(!isNotificationOpen);
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
              <Button color="inherit" onClick={handleFeedbackClick}>
                Feed Back
              </Button>
            </div>
          </Typography>
          <div>
            <IconButton color="inherit" onClick={toggleNotificationDrawer}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton edge="end" color="inherit" className="username-button" onClick={handleUsernameClick}>
              <AccountCircle />
              &nbsp; {username}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {isNotificationOpen && (
        <div className="notification-drawer">
          <Dialog open={isNotificationOpen} onClose={toggleNotificationDrawer}>
            <DialogTitle>Notifications</DialogTitle>
            <DialogContent>
              {loadingNotifications && <CircularProgress />}
              {errorNotifications && <Typography color="error">{errorNotifications}</Typography>}
              {!loadingNotifications && notifications.length === 0 && (
                <Typography>No new notifications.</Typography>
              )}
              {!loadingNotifications && notifications.length > 0 && (
                <List>
                  {notifications.map((notification) => (
                    <ListItem key={notification.id}>
                      <ListItemText primary={notification.message} secondary={new Date(notification.createdAt).toLocaleString()} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNotification(notification.id)}>
                          <CloseIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={toggleNotificationDrawer} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}

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