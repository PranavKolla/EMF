// FeedbackDashboard.jsx
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
  TextField,
  Rating,
  Box,
  Modal,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';

function FeedbackDashboard() {
  const [bookedEventsWithTickets, setBookedEventsWithTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackSubmitLoading, setFeedbackSubmitLoading] = useState(false);
  const [feedbackSubmitError, setFeedbackSubmitError] = useState('');
  const [feedbackSubmitSuccess, setFeedbackSubmitSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.userId);
        fetchBookedEvents(decoded.userId, token);
      } catch (err) {
        console.error('Invalid token:', err);
        setError('Authentication error.');
        setLoading(false);
      }
    } else {
      setError('No authentication token found.');
      setLoading(false);
    }
  }, []);

  const fetchBookedEvents = async (userId, authToken) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:9090/tickets/userTicket/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch booked events: ${response.status} - ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      // Group tickets by event to avoid duplicate event cards
      const eventsMap = new Map();
      data.forEach(ticket => {
        if (!eventsMap.has(ticket.event.eventId)) {
          eventsMap.set(ticket.event.eventId, ticket.event);
        }
      });
      setBookedEventsWithTickets(Array.from(eventsMap.values()));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booked events:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const openFeedbackModal = (eventId) => {
    setSelectedEventId(eventId);
    setFeedbackMessage('');
    setFeedbackRating(0);
    setIsFeedbackModalOpen(true);
    setFeedbackSubmitSuccess(false);
    setFeedbackSubmitError('');
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedEventId(null);
  };

  const handleFeedbackChange = (event) => {
    setFeedbackMessage(event.target.value);
  };

  const handleRatingChange = (event, newValue) => {
    setFeedbackRating(newValue);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim() || feedbackRating === 0) {
      setFeedbackSubmitError('Please provide a message and a rating.');
      return;
    }

    // Convert rating to an integer between 1 and 5
    const ratingToSend = Math.min(5, Math.max(1, Math.round(feedbackRating)));

    setFeedbackSubmitLoading(true);
    setFeedbackSubmitError('');
    setFeedbackSubmitSuccess(false);

    try {
      const token = localStorage.getItem('jwtToken');
      const params = new URLSearchParams();
      params.append('eventId', selectedEventId);
      params.append('userId', currentUserId);
      params.append('message', feedbackMessage);
      params.append('rating', ratingToSend.toString()); // Convert rating to string for URL

      const url = `http://localhost:9090/feedback/submit?${params.toString()}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove 'Content-Type: application/json' as we are not sending JSON body
        },
        // Do not include a body as the data is in the URL
      });

      if (!response.ok) {
        let errorMessage = `Failed to submit feedback: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || response.statusText}`;
        } catch (jsonError) {
          console.error("Failed to parse error JSON:", jsonError);
          errorMessage += ` - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Attempt to parse JSON only if the response is ok (status 2xx)
      if (response.status >= 200 && response.status < 300) {
        try {
          const responseData = await response.json();
          setFeedbackSubmitLoading(false);
          setFeedbackSubmitSuccess(true);
          console.log("Feedback submitted successfully:", responseData); // Log success response
          // Optionally, you can close the modal after successful submission
          // setTimeout(closeFeedbackModal, 1500);
        } catch (jsonError) {
          console.error("Failed to parse success JSON:", jsonError);
          setFeedbackSubmitLoading(false);
          setFeedbackSubmitSuccess(true); // Consider it a success if we got a 2xx but couldn't parse (unlikely scenario)
          // Optionally, you can close the modal
          // setTimeout(closeFeedbackModal, 1500);
        }
      } else {
        // This block should ideally be handled by the response.ok check above
        setFeedbackSubmitLoading(false);
        setFeedbackSubmitError(`Failed to submit feedback: ${response.status}`);
      }

    } catch (err) {
      console.error('Error submitting feedback:', err);
      setFeedbackSubmitError(err.message);
      setFeedbackSubmitLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={handleGoBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Feedback Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ flexGrow: 1, marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Give Feedback on Your Booked Events
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : bookedEventsWithTickets.length > 0 ? (
          <Grid container spacing={3}>
            {bookedEventsWithTickets.map((event) => (
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
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: '15px' }}
                      onClick={() => openFeedbackModal(event.eventId)}
                    >
                      Give Feedback
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No past bookings found to give feedback on.</Typography>
        )}

        {/* Feedback Modal */}
        <Modal open={isFeedbackModalOpen} onClose={closeFeedbackModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <IconButton
              onClick={closeFeedbackModal}
              sx={{ position: 'absolute', top: 10, right: 10 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              Submit Feedback
            </Typography>
            {feedbackSubmitSuccess && (
              <Typography color="success" gutterBottom>
                Feedback submitted successfully!
              </Typography>
            )}
            {feedbackSubmitError && (
              <Typography color="error" gutterBottom>
                {feedbackSubmitError}
              </Typography>
            )}
            <TextField
              label="Your Feedback"
              multiline
              rows={4}
              fullWidth
              value={feedbackMessage}
              onChange={handleFeedbackChange}
              margin="normal"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography component="legend">Rating:</Typography>
              <Rating
                name="event-rating"
                value={feedbackRating}
                onChange={handleRatingChange}
                sx={{ ml: 1 }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitFeedback}
              disabled={feedbackSubmitLoading}
              sx={{ mt: 2 }}
            >
              {feedbackSubmitLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
            </Button>
          </Box>
        </Modal>
      </Container>
    </div>
  );
}

export default FeedbackDashboard;