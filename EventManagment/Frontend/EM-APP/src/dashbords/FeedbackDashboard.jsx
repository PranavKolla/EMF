import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch(`http://localhost:9090/tickets/userTicket/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch booked events: ${response.status} - ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
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
      const params = new URLSearchParams();
      params.append('eventId', selectedEventId);
      params.append('userId', currentUserId);
      params.append('message', feedbackMessage);
      params.append('rating', ratingToSend.toString());

      const url = `http://localhost:9090/feedback/submit?${params.toString()}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `Failed to submit feedback: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || response.statusText}`;
        } catch (jsonError) {
          errorMessage += ` - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setFeedbackSubmitLoading(false);
      setFeedbackSubmitSuccess(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setFeedbackSubmitError(err.message);
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