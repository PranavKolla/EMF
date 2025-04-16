import React from "react";
import "./css/Ticket.css"; // Import your CSS file

const Ticket = ({ issuedBy, inviteNumber, bookingDate, status }) => {
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
          <div className="number">Get<br /> Ready</div>
          <div className="invite">Invite for you</div>
        </div>
        <div className="check">
          <div className="big">
            You're <br /> Invited
          </div>
          <div className="number">#1</div>
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