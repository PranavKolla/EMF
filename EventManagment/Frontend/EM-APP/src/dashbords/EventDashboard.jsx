import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Ticket from "../components/Ticket";

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
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">Loading events...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Explore Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.eventId}>
            <Card>
              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleBookEvent(event)}>
                  Book
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: "60vw",
            height: "auto",
            maxHeight: "90vh",
          }}
        >
          <IconButton onClick={handleCloseModal} sx={{ position: "absolute", top: 10, right: 10 }}>
            <CloseIcon />
          </IconButton>
          {ticketData && (
            <Ticket
              eventName={ticketData.eventName} // Pass eventName
              issuedBy={ticketData.issuedBy}
              inviteNumber={ticketData.ticketID}
              bookingDate={new Date(ticketData.bookingDate).toLocaleDateString()}
              status={ticketData.status}
            />
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default EventDashboard;