import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './css/Home.css'; // Ensure this file contains the new styles
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; // Import the EventCard component
import axios from 'axios'; // Import Axios

function Home() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [events, setEvents] = useState([]); // Store all events
  const [filteredEvents, setFilteredEvents] = useState([]); // Store filtered events
  const [searchQuery, setSearchQuery] = useState(''); // Store search input
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

    // Fetch all events
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No token found. Redirecting to login.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9090/events/view/all', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error.response?.data?.message || error.message);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter events based on the search query
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
  };

  const handleBookEvent = async (eventId) => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.error('Authentication token not found. Redirecting to login.');
      navigate('/login');
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    } catch (err) {
      console.error('Failed to decode token:', err.message);
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9090/tickets/book`,
        null,
        {
          params: { eventId, userId },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Booking successful! Ticket ID: ${response.data.ticketID}`);
    } catch (error) {
      console.error('Error during booking:', error.response?.data?.message || error.message);
      alert(`Failed to book ticket: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleExploreClick = () => {
    navigate('/events');
  };

  return (
    <div className="root">
      <Navbar username={username} />

      <div className="centered-container">
        {/* Functional Search Bar */}
        <div className="brutalist-container">
          <input
            placeholder="Search Events"
            className="brutalist-input smooth-type"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange} // Handle search input
          />
          <label className="brutalist-label">Search Events</label>
        </div>

        {/* Display Filtered Events Only After Search */}
        {searchQuery && filteredEvents.length > 0 && (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div key={event.eventId} className="event-card-wrapper">
                <EventCard
                  eventName={event.name}
                  category={event.category}
                  date={new Date(event.date).toLocaleDateString()}
                  location={event.location}
                  userName={event.organizerName}
                  rating={event.rating}
                  onBook={() => handleBookEvent(event.eventId)} // Pass booking handler
                />
              </div>
            ))}
          </div>
        )}

        {/* Show message if no events match the search */}
        {searchQuery && filteredEvents.length === 0 && (
          <p className="no-events-message">No events found for your search.</p>
        )}

        <div className="mainContentContainer">
          <h1 className="title">THE LAND OF EVENTS</h1>
          <p className="subtitle">SMALL DESCRIPTION ABOUT SITE</p>
          <button className="exploreButton" onClick={handleExploreClick}>
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;