import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import  { jwtDecode } from 'jwt-decode';
import EventCard from '../components/EventCard';
import EventFormDialog from '../components/EventFormDialog';
import UserFormDialog from '../components/UserFormDialog';
import './css/OrganizerDashboard.css'; // Import your CSS file
 
const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEventForm, setOpenEventForm] = useState(false);
  const [openUserForm, setOpenUserForm] = useState(false); // State for user form dialog
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [isCreating, setIsCreating] = useState(false);
 
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
 
      // Fetch user details
      fetch(`http://localhost:9090/users/${userId}`, {
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
          setSelectedUser(data); // Set the fetched user details
        })
        .catch(error => {
          setError(`Failed to fetch user details: ${error.message}`);
        });
    } catch (err) {
      setError('Invalid token. Please log in again.');
      setLoading(false);
    }
  }, []);
 
  const handleUpdateUser = () => {
    setOpenUserForm(true); // Open the user form dialog
  };
 
  const handleSaveUser = () => {
    const token = localStorage.getItem('jwtToken');
 
    // Prepare the body for the update request
    const updatedUser = {
      userName: selectedUser.userName,
      email: selectedUser.email,
      contactNumber: selectedUser.contactNumber,
    };
 
    // Include the password only if it is not empty
    if (selectedUser.password && selectedUser.password.trim() !== '') {
      updatedUser.password = selectedUser.password;
    }
 
    fetch(`http://localhost:9090/users/update/${selectedUser.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser), // Send the updated user details
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setOpenUserForm(false); // Close the user form dialog
      })
      .catch((error) => {
        setError(`Failed to update user: ${error.message}`);
      });
  };
 
  const handleCancelUser = () => {
    setOpenUserForm(false); // Close the user form dialog
  };
 
  const handleCreateEvent = () => {
    setIsCreating(true);
    setSelectedEvent({ name: '', category: '', location: '', date: '' }); // Initialize the form with empty values
    setOpenEventForm(true);
  };
 
  const handleUpdateEvent = (event) => {
    setIsCreating(false);
    setSelectedEvent(event);
    setOpenEventForm(true);
  };
 
  const handleDeleteEvent = (eventId) => {
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
          // Optionally, show a success message
        })
        .catch(error => {
          setError(`Failed to delete event: ${error.message}`);
          // Optionally, show an error message
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
        // Optionally, show a success message
      })
      .catch(error => {
        setError(`Failed to ${isCreating ? 'create' : 'update'} event: ${error.message}`);
        // Optionally, show an error message to the user
      });
  };
 
  const handleCancelEvent = () => {
    setOpenEventForm(false);
    setIsCreating(false);
    setSelectedEvent(null);
  };
 
  if (loading) {
    return <Typography variant="h6">Loading events...</Typography>;
  }
 
  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }
 
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Organizer Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleUpdateUser} style={{ marginBottom: '20px' }}>
        Update User
      </Button>
      <Button variant="contained" color="primary" onClick={handleCreateEvent} style={{ marginBottom: '20px' }}>
        Create Event
      </Button>
      {Array.isArray(events) && events.length === 0 ? (
        <Typography variant="h6">No events available.</Typography>
      ) : (
        events.map(event => (
          <EventCard
            key={event.eventId}
            event={event}
            onUpdate={() => handleUpdateEvent(event)}
            onDelete={() => handleDeleteEvent(event.eventId)}
          />
        ))
      )}
      <EventFormDialog
        open={openEventForm}
        isCreating={isCreating}
        selectedEvent={selectedEvent}
        onChange={setSelectedEvent}
        onCancel={handleCancelEvent}
        onSave={handleSaveEvent}
      />
      <UserFormDialog
        open={openUserForm}
        selectedUser={selectedUser}
        onChange={setSelectedUser}
        onCancel={handleCancelUser}
        onSave={handleSaveUser}
      />
    </Container>
  );
};
 
export default OrganizerDashboard;