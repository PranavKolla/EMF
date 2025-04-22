import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BookingCard from '../components/BookingCard'; // Adjust the path if needed
import Navbar from '../components/Navbar'; // Adjust the path if needed
import Ticket from '../components/Ticket'; // Import the Ticket component
import './css/BookingDashboard.css'; // You can reuse or modify this CSS
import axios from 'axios'; // Import Axios

const BookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [groupedBookings, setGroupedBookings] = useState([]); // State for grouped bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null); // State to store the selected booking
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchBookings(decoded.userId, token);
      } catch (err) {
        console.error('Invalid token:', err);
        setError('Authentication error.');
        setLoading(false);
        return;
      }
    } else {
      setError('No authentication token found.');
      setLoading(false);
    }
  }, [navigate]);

  const fetchBookings = async (currentUserId, authToken) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:9090/tickets/userTicket/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Group bookings by event
      const grouped = groupBookingsByEvent(response.data);
      setGroupedBookings(grouped);
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || err.message);
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
      ticketID: group.ticketIDs.join('/'), // Combine ticket IDs into a single string
    }));
  };

  const handleGoBack = () => {
    if (selectedBooking) {
      setSelectedBooking(null); // Go back to the booking list
    } else {
      navigate('/');
    }
  };

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking); // Set the selected booking to display the Ticket component
  };

  const handleCancelTickets = async (booking) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('Authentication token not found. Redirecting to login.');
      navigate('/login');
      return;
    }

    if (window.confirm('Are you sure you want to cancel all tickets for this event?')) {
      try {
        // Cancel all tickets for the selected booking
        const cancelPromises = booking.ticketIDs.map((ticketID) =>
          axios.put(`http://localhost:9090/tickets/cancel/${ticketID}`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        // Wait for all cancellation requests to complete
        const responses = await Promise.all(cancelPromises);

        // Check if any cancellation failed
        const failedResponses = responses.filter((response) => response.status !== 200);
        if (failedResponses.length > 0) {
          throw new Error('Failed to cancel some tickets. Please try again.');
        }

        // Remove the canceled tickets from the state
        setGroupedBookings((prevBookings) =>
          prevBookings.filter((b) => b.event?.eventId !== booking.event?.eventId)
        );

        alert('All tickets for this event have been canceled successfully!');
      } catch (err) {
        console.error('Error canceling tickets:', err);
        alert('Failed to cancel tickets. Please try again.');
      }
    }
  };

  const handleCancelTicket = async (ticketID) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('Authentication token not found. Redirecting to login.');
      navigate('/login');
      return;
    }

    if (window.confirm(`Are you sure you want to cancel ticket #${ticketID}?`)) {
      try {
        await axios.put(`http://localhost:9090/tickets/cancel/${ticketID}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the selected booking's ticket list
        setSelectedBooking((prevBooking) => ({
          ...prevBooking,
          ticketIDs: prevBooking.ticketIDs.filter((id) => id !== ticketID),
        }));

        alert(`Ticket #${ticketID} has been canceled successfully!`);
      } catch (err) {
        console.error('Error canceling ticket:', err);
        alert('Failed to cancel the ticket. Please try again.');
      }
    }
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
                onCancel={handleCancelTicket} // Pass the cancel handler
              />
            ))}
            <button onClick={handleGoBack}>Back to Bookings</button>
          </div>
        ) : (
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
                    onCancel={() => handleCancelTickets(booking)} // Pass the cancel handler
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