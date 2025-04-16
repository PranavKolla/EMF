import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function EventDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedTicket, setBookedTicket] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:9090/events/view/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Unauthorized access. Please log in again.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        setError(`Failed to fetch events: ${error.message}`);
        setLoading(false);
      });
  }, []);

  const handleBookEvent = (eventId) => {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

    if (!token || !userId) {
      console.error('Authentication token or User ID not found.');
      navigate('/login'); // Redirect to login if token or userId is missing
      return;
    }

    fetch(`http://localhost:9090/tickets/book?eventId=${eventId}&userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Bearer token here
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Booking failed: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Booking successful:', data);
        setBookedTicket(data);
        setBookingSuccess(true);
        setOpenModal(true); // Open the modal after successful booking
      })
      .catch(error => {
        console.error('Error during booking:', error);
        setError(`Failed to book ticket: ${error.message}`);
      });
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setBookedTicket(null);
    setBookingSuccess(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">Loading events...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container className="eventDashboardContainer">
      <Typography variant="h4" gutterBottom align="center">
        Explore Events
      </Typography>
      <Box display="flex" justifyContent="center">
        <Grid container spacing={3} maxWidth="md" justifyContent="center">
          {events.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event.eventId}>
              <Card className="eventCard">
                <CardContent>
                  <Typography variant="h6" component="div">
                    {event.name}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Category: {event.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Location: {event.location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleBookEvent(event.eventId)}>
                    Book
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal for displaying the booked ticket */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="ticket-modal-title"
        aria-describedby="ticket-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '1px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="ticket-modal-title" variant="h6" component="h2" gutterBottom>
            Your Ticket
            <Button onClick={handleCloseModal} style={{ float: 'right', cursor: 'pointer' }}>
              X
            </Button>
          </Typography>
          {bookedTicket && (
            <Box>
              <Typography id="ticket-modal-description">
                Ticket ID: {bookedTicket.ticketID}
              </Typography>
              <Typography>
                Event: {bookedTicket.event && bookedTicket.event.name}
              </Typography>
              <Typography>
                Booking Date: {new Date(bookedTicket.bookingDate).toLocaleString()}
              </Typography>
              <Typography>
                Status: {bookedTicket.status}
              </Typography>
              {/* Add other ticket details you want to display */}
            </Box>
          )}
          {!bookedTicket && bookingSuccess && (
            <Typography color="success">Ticket booked successfully!</Typography>
          )}
          {!bookedTicket && !bookingSuccess && error && (
            <Typography color="error">{error}</Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default EventDashboard;