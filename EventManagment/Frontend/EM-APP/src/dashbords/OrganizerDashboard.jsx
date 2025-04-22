import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import EventFormDialog from '../components/EventFormDialog';

import './css/OrganizerDashboard.css'; // Import your CSS file
import Navbar from '../components/Navbar'; // Import the Navbar component

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEventForm, setOpenEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]); // State to store feedbacks
  const [viewingFeedback, setViewingFeedback] = useState(false); // State to toggle feedback view

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Fetch events
      fetch(`http://localhost:9090/events/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
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
    } catch (err) {
      setError('Invalid token. Please log in again.');
      setLoading(false);
    }
  }, []);

  const handleCreateEvent = () => {
    setIsCreating(true);
    setSelectedEvent({ name: '', category: '', location: '', date: '' }); // Initialize the form with empty values
    setOpenEventForm(true);
  };

  const handleUpdateEvent = event => {
    setIsCreating(false);
    setSelectedEvent(event);
    setOpenEventForm(true);
  };

  const handleDeleteEvent = eventId => {
    const token = localStorage.getItem('jwtToken');
    if (window.confirm('Are you sure you want to delete this event?')) {
      fetch(`http://localhost:9090/events/manage/delete/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // Remove the deleted event from the local state
          setEvents(prevEvents => prevEvents.filter(event => event.eventId !== eventId));
        })
        .catch(error => {
          setError(`Failed to delete event: ${error.message}`);
        });
    }
  };

  const handleSaveEvent = () => {
    const token = localStorage.getItem('jwtToken');
    const userId = jwtDecode(token).userId;
    const apiUrl = isCreating
      ? 'http://localhost:9090/events/manage/create'
      : `http://localhost:9090/events/manage/update/${selectedEvent?.eventId}`;
    const method = isCreating ? 'POST' : 'PUT';

    fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(isCreating ? { ...selectedEvent, organizerId: userId } : selectedEvent),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(updatedEvent => {
        if (isCreating) {
          setEvents(prevEvents => [...prevEvents, updatedEvent]);
        } else {
          setEvents(prevEvents =>
            prevEvents.map(event =>
              event.eventId === updatedEvent.eventId ? updatedEvent : event
            )
          );
        }
        setOpenEventForm(false);
        setIsCreating(false);
        setSelectedEvent(null);
      })
      .catch(error => {
        setError(`Failed to ${isCreating ? 'create' : 'update'} event: ${error.message}`);
      });
  };

  const handleCancelEvent = () => {
    setOpenEventForm(false);
    setIsCreating(false);
    setSelectedEvent(null);
  };

  const handleViewFeedback = async (eventId) => {
    const token = localStorage.getItem('jwtToken');
    setViewingFeedback(true);
    try {
      const response = await fetch(`http://localhost:9090/feedback/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }

      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to fetch feedbacks.');
    }
  };

  const handleBackToEvents = () => {
    setViewingFeedback(false);
    setFeedbacks([]);
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="organizer-dashboard-container">
        <h1 className="dashboard-title">Organizer Dashboard</h1>
        {viewingFeedback ? (
          <div className="feedback-list">
            <h2>Feedbacks</h2>
            {feedbacks.length === 0 ? (
              <p>No feedbacks found for this event.</p>
            ) : (
              feedbacks.map(feedback => (
                <div className="feedback-card" key={feedback.feedbackId}>
                  <p><strong>Message:</strong> {feedback.message}</p>
                  <p><strong>Rating:</strong> {feedback.rating} / 5</p>
                </div>
              ))
            )}
            <button onClick={handleBackToEvents}>Back to Events</button>
          </div>
        ) : (
          <>
            <button className="dashboard-button" onClick={handleCreateEvent}>
              Create Event
            </button>
            <div className="events-grid">
              {events.map(event => (
                <div className="event-card" key={event.eventId}>
                  <div className="event-card-header">{event.name}</div>
                  <div className="event-card-content">{event.description}</div>
                  <div className="event-card-footer">
                    <button className="update-button" onClick={() => handleUpdateEvent(event)}>
                      Update
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteEvent(event.eventId)}>
                      Delete
                    </button>
                    <button className="view-feedback-button" onClick={() => handleViewFeedback(event.eventId)}>
                      View Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <EventFormDialog
          open={openEventForm}
          isCreating={isCreating}
          selectedEvent={selectedEvent}
          onChange={setSelectedEvent}
          onCancel={handleCancelEvent}
          onSave={handleSaveEvent}
        />
      </div>
    </>
  );
};

export default OrganizerDashboard;