import React from "react";
import "./css/Ticket.css"; // Import your CSS file
import { jwtDecode } from "jwt-decode";

const Ticket = ({ eventName, issuedBy, inviteNumber, bookingDate, status, onCancel }) => {
  let usernameFromToken = "";
  const token = localStorage.getItem("jwtToken");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      usernameFromToken = decodedToken.sub || "User"; // Use 'sub' to get the username
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  }

  const handleCancel = () => {
    if (window.confirm(`Are you sure you want to cancel ticket #${inviteNumber}?`)) {
      onCancel(inviteNumber); // Call the onCancel function passed as a prop
    }
  };

  return (
    <div className="ticket-container">
      <div className="ticket">
        <div className="ticket-header">
          <h2 className="event-name">{eventName}</h2>
          <p className="invite-number">Invite #{inviteNumber}</p>
        </div>
        <div className="ticket-body">
          <div className="ticket-info">
            <p>
              <span className="label">Issued By:</span> {issuedBy}
            </p>
            <p>
              <span className="label">Booking Date:</span> {bookingDate}
            </p>
            <p>
              <span className="label">Status:</span> {status}
            </p>
          </div>
          <div className="ticket-user">
            <p className="username">Welcome, {usernameFromToken}</p>
            <p className="invite-message">You're Invited!</p>
          </div>
        </div>
        <div className="ticket-footer">
          <p className="footer-text">Thank you for being part of our event!</p>
          <button className="cancel-ticket-btn" onClick={handleCancel}>
            Cancel Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;