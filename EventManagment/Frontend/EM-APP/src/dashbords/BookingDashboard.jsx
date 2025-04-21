import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BookingCard from '../components/BookingCard'; // Adjust the path if needed
import Navbar from '../components/Navbar'; // Adjust the path if needed
import Ticket from '../components/Ticket'; // Import the Ticket component
import './css/BookingDashboard.css'; // You can reuse or modify this CSS

const BookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [groupedBookings, setGroupedBookings] = useState([]); // State for grouped bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null); // State to store the selected booking
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchBookings(decoded.userId, token);
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Authentication error.");
        setLoading(false);
        return;
      }
    } else {
      setError("No authentication token found.");
      setLoading(false);
    }
  }, [navigate]);

  const fetchBookings = async (currentUserId, authToken) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:9090/tickets/userTicket/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to fetch bookings: ${response.status} - ${errorData.message || response.statusText}`
        );
      }
      const data = await response.json();

      // Group bookings by event
      const grouped = groupBookingsByEvent(data);
      setGroupedBookings(grouped);
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const groupBookingsByEvent = (bookings) => {
    const grouped = {};
    bookings.forEach((booking) => {
      const eventId = booking.event?.eventId;
      if (!grouped[eventId]) {
        grouped[eventId] = {
          ...booking,
          ticketIDs: [booking.ticketID], // Initialize ticketIDs array
        };
      } else {
        grouped[eventId].ticketIDs.push(booking.ticketID); // Add ticketID to the array
      }
    });
    return Object.values(grouped).map((group) => ({
      ...group,
      ticketID: group.ticketIDs.join("/"), // Combine ticket IDs into a single string
    }));
  };

  const handleGoBack = () => {
    if (selectedBooking) {
      setSelectedBooking(null); // Go back to the booking list
    } else {
      navigate("/");
    }
  };

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking); // Set the selected booking to display the Ticket component
  };

  if (loading) {
    return <div>Loading your bookings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="booking-dashboard">
      <Navbar />
      <div className="dashboard-content">
        {selectedBooking ? (
          // Show the Ticket component if a booking is selected
          <div className="ticket-list">
            <h2>Tickets for {selectedBooking.event?.name}</h2>
            {selectedBooking.ticketIDs.map((ticketID) => (
              <Ticket
                key={ticketID}
                eventName={selectedBooking.event?.name}
                issuedBy={selectedBooking.event?.user?.userName}
                inviteNumber={ticketID}
                bookingDate={selectedBooking.event?.date}
                status={selectedBooking.status}
              />
            ))}
            <button onClick={handleGoBack}>Back to Bookings</button>
          </div>
        ) : (
          // Show the booking list if no booking is selected
          <>
            <h2>Your Bookings</h2>
            {groupedBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <div className="booking-list">
                {groupedBookings.map((booking) => (
                  <BookingCard
                    key={booking.event?.eventId}
                    ticketID={booking.ticketID} // Combined ticket IDs
                    eventName={booking.event?.name}
                    date={booking.event?.date}
                    location={booking.event?.location}
                    organizerName={booking.event?.user?.userName}
                    onView={() => handleViewTicket(booking)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;