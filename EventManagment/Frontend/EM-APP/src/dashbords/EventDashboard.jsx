import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Ticket from "../components/Ticket";
import Navbar from "../components/Navbar"; // Assuming Navbar component is in the same directory
import EventCard from "../components/EventCard"; // Assuming EventCard component is in the same directory
import "./css/EventDashboard.css"; // Import CSS for styling

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

    fetch("http://localhost:9090/events/view/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Unauthorized access. Please log in again.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const eventsWithRatings = data.map((event) => ({
          ...event,
          rating: null, // Initialize rating as null
        }));
        setEvents(eventsWithRatings);
        setLoading(false);

        // Fetch ratings for each event
        eventsWithRatings.forEach((event) => {
          fetch(`http://localhost:9090/feedback/event/${event.eventId}/rating`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch rating for event ${event.eventId}`);
              }
              return response.json();
            })
            .then((rating) => {
              setEvents((prevEvents) =>
                prevEvents.map((e) =>
                  e.eventId === event.eventId ? { ...e, rating: rating || "No Rating" } : e
                )
              );
            })
            .catch((err) => {
              console.error(`Failed to fetch rating for event ${event.eventId}:`, err.message);
            });
        });
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleBookEvent = (event) => {
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

    fetch(`http://localhost:9090/tickets/book?eventId=${event.eventId}&userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Booking failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Booking successful:", data);
        setTicketData({
          ...data,
          eventName: event.name, // Add event name to ticket data
          issuedBy: event.user?.userName || "Unknown", // Assuming the event object has a user with userName
        });
        setOpenModal(true);
      })
      .catch((err) => {
        console.error("Error during booking:", err.message);
        alert(`Failed to book ticket: ${err.message}`);
      });
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