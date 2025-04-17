import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Modal,
  Box,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Ticket from '../components/Ticket'; // Import the Ticket component
import CloseIcon from '@mui/icons-material/Close'; // Import close icon for the modal

function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null); // State to hold the ticket data for the modal
  const [openModal, setOpenModal] = useState(false); // State to control the modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchBookings(decoded.userId, token);
      } catch (err) {
        console.error('Invalid token:', err);
        setError('Authentication error.');
        setLoading(false);
        return;
      }
    } else {
      setError('No authentication token found.');
      setLoading(false);
    }
  }, []);

  const fetchBookings = async (currentUserId, authToken) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:9090/tickets/userTicket/${currentUserId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch bookings: ${response.status} - ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTicket(null);
  };

  // Group bookings by event
  const bookedEvents = bookings.reduce((acc, booking) => {
    if (!acc[booking.event.eventId]) {
      acc[booking.event.eventId] = booking.event;
      acc[booking.event.eventId].ticketsForEvent = []; // Add an array to store tickets for this event
    }
    acc[booking.event.eventId].ticketsForEvent.push(booking);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={handleGoBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Booking History</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ flexGrow: 1, marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Your Booked Events
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : Object.values(bookedEvents).length > 0 ? (
          <Grid container spacing={3}>
            {Object.values(bookedEvents).map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.eventId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {event.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {event.category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Location: {event.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    {event.ticketsForEvent.map((ticket) => (
                      <Button
                        key={ticket.ticketID}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px', marginRight: '5px' }}
                        onClick={() => handleViewTicket(ticket)}
                      >
                        View Ticket ({ticket.ticketID})
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No previous bookings found.</Typography>
        )}
        {/* Modal for displaying the ticket */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                width: "60vw",
                height: "auto", // Adjust height to fit content
                maxHeight: "90vh", // Ensure it doesn't exceed the viewport height
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{ position: 'absolute', top: 10, right: 10 }}
            >
              <CloseIcon />
            </IconButton>
            {selectedTicket && (
              <Ticket
                eventName={selectedTicket.event.name} // Pass the event name as a prop
                issuedBy={selectedTicket.event.user.userName} // Assuming event has user details
                inviteNumber={selectedTicket.ticketID}
                bookingDate={new Date(selectedTicket.bookingDate).toLocaleDateString()}
                status={selectedTicket.status}
              />
            )}
          </Box>
        </Modal>
      </Container>
    </div>
  );
}

export default BookingDashboard;