import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './css/FeedbackDashboard.css'; // Add your custom CSS file

function FeedbackDashboard() {
  const [bookedEventsWithTickets, setBookedEventsWithTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackSubmitLoading, setFeedbackSubmitLoading] = useState(false);
  const [feedbackSubmitError, setFeedbackSubmitError] = useState('');
  const [feedbackSubmitSuccess, setFeedbackSubmitSuccess] = useState(false);
  const navigate = useNavigate();

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
      const response = await axios.get(`http://localhost:9090/tickets/userTicket/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const eventsMap = new Map();
      response.data.forEach(ticket => {
        if (!eventsMap.has(ticket.event.eventId)) {
          eventsMap.set(ticket.event.eventId, ticket.event);
        }
      });
      setBookedEventsWithTickets(Array.from(eventsMap.values()));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booked events:', err);
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const openFeedbackModal = eventId => {
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

  const handleFeedbackChange = event => {
    setFeedbackMessage(event.target.value);
  };

  const handleRatingChange = event => {
    setFeedbackRating(Number(event.target.value));
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim() || feedbackRating === 0) {
      setFeedbackSubmitError('Please provide a message and a rating.');
      return;
    }

    const ratingToSend = Math.min(5, Math.max(1, Math.round(feedbackRating)));

    setFeedbackSubmitLoading(true);
    setFeedbackSubmitError('');
    setFeedbackSubmitSuccess(false);

    try {
      const token = localStorage.getItem('jwtToken');
      const params = {
        eventId: selectedEventId,
        userId: currentUserId,
        message: feedbackMessage,
        rating: ratingToSend,
      };

      const response = await axios.post('http://localhost:9090/feedback/submit', null, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFeedbackSubmitLoading(false);
      setFeedbackSubmitSuccess(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      window.alert(errorMessage); // Show clean error message in a popup
      setFeedbackSubmitLoading(false);
    }
  };

  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <div className="feedback-dashboard-container">
        <h1>Give Feedback on Your Booked Events</h1>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : bookedEventsWithTickets.length > 0 ? (
          <div className="events-grid">
            {bookedEventsWithTickets.map(event => (
              <div className="event-card" key={event.eventId}>
                <h3>{event.name}</h3>
                <p>Category: {event.category}</p>
                <p>Location: {event.location}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <button className="feedback-button" onClick={() => openFeedbackModal(event.eventId)}>
                  Give Feedback
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>No past bookings found to give feedback on.</div>
        )}

        {isFeedbackModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={closeFeedbackModal}>
                &times;
              </button>
              <h2>Submit Feedback</h2>
              {feedbackSubmitSuccess && <p className="success">Feedback submitted successfully!</p>}
              {feedbackSubmitError && <p className="error">{feedbackSubmitError}</p>}
              <textarea
                placeholder="Your Feedback"
                value={feedbackMessage}
                onChange={handleFeedbackChange}
                rows="4"
              ></textarea>
              <div className="rating-container">
                <label>Rating:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={feedbackRating}
                  onChange={handleRatingChange}
                />
              </div>
              <button
                className="submit-button"
                onClick={handleSubmitFeedback}
                disabled={feedbackSubmitLoading}
              >
                {feedbackSubmitLoading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FeedbackDashboard;