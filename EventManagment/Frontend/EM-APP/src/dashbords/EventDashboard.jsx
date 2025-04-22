import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Ticket from "../components/Ticket";
import Navbar from "../components/Navbar"; // Assuming Navbar component is in the same directory
import EventCard from "../components/EventCard"; // Assuming EventCard component is in the same directory
import "./css/EventDashboard.css"; // Import CSS for styling
import axios from "axios"; // Import Axios

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:9090/events/view/all", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const eventsWithRatings = response.data.map((event) => ({
          ...event,
          rating: null, // Initialize rating as null
        }));
        setEvents(eventsWithRatings);
        setLoading(false);

        // Fetch ratings for each event
        eventsWithRatings.forEach(async (event) => {
          try {
            const ratingResponse = await axios.get(
              `http://localhost:9090/feedback/event/${event.eventId}/rating`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const rating = ratingResponse.data || "No Rating";
            setEvents((prevEvents) =>
              prevEvents.map((e) =>
                e.eventId === event.eventId ? { ...e, rating } : e
              )
            );
          } catch (err) {
            console.error(`Failed to fetch rating for event ${event.eventId}:`, err.message);
          }
        });
      } catch (err) {
        console.error("Failed to fetch events:", err.message);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const handleBookEvent = async (event) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("Authentication token not found. Redirecting to login.");
      navigate("/login");
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    } catch (err) {
      console.error("Failed to decode token:", err.message);
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9090/tickets/book`,
        null,
        {
          params: { eventId: event.eventId, userId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTicketData({
        ...response.data,
        eventName: event.name, // Add event name to ticket data
        issuedBy: event.user?.userName || "Unknown", // Assuming the event object has a user with userName
      });
      setOpenModal(true);
    } catch (err) {
      console.error("Error during booking:", err.message);
      alert(`Failed to book ticket: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTicketData(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="event-dashboard-container">
      <Navbar />
      <h2 className="dashboard-title">Explore Events</h2>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.eventId} className="event-card-wrapper">
            <EventCard
              eventName={event.name}
              category={event.category}
              date={new Date(event.date).toLocaleDateString()} // Correct prop: date
              location={event.location} // Correct prop: location
              userName={event.user?.userName} // Correct prop: userName
              rating={event.rating} // Pass the rating to the EventCard
              onBook={() => handleBookEvent(event)}
            />
          </div>
        ))}
      </div>

      {openModal && ticketData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <Ticket
              eventName={ticketData.eventName}
              issuedBy={ticketData.issuedBy}
              inviteNumber={ticketData.ticketID}
              bookingDate={new Date(ticketData.bookingDate).toLocaleDateString()}
              status={ticketData.status}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDashboard;