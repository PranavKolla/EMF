import React from "react";
import "./css/Ticket.css"; // Import your CSS file
import { jwtDecode } from 'jwt-decode';

const Ticket = ({ eventName, issuedBy, inviteNumber, bookingDate, status }) => {
  let usernameFromToken = '';
  const token = localStorage.getItem('jwtToken');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      usernameFromToken = decodedToken.sub || 'User'; // Use 'sub' to get the username
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  }

  return (
    <div className="ticket-container">
      <div className="ticket">
        <div className="stub">
          <div className="top">
            <span className="admit">TICKET</span>
            <span className="line"></span>
            <span className="num">
              Invitation
              <span>{inviteNumber}</span>
            </span>
          </div>
          <div className="number">{eventName}</div> {/* Display event name here */}
          <div className="invite">Invite for you</div>
        </div>
        <div className="check">
          <div className="big">
            You're <br /> Invited
          </div>
          <div className="number">{usernameFromToken}</div> {/* Display username from JWT ('sub' field) */}
          <div className="info">
            <section>
              <div className="title">Issued By</div>
              <div>{issuedBy}</div>
            </section>
            <section>
              <div className="title">Invite Number</div>
              <div>{inviteNumber}</div>
            </section>
            <section>
              <div className="title">Booking Date</div>
              <div>{bookingDate}</div>
            </section>
            <section>
              <div className="title">Status</div>
              <div>{status}</div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;