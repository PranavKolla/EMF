// bookingcard.jsx
import React from 'react';
import './css/BookingCard.css'; // Adjust the path if needed

const BookingCard = ({ ticketID, eventName, date, location, organizerName, onView, onCancel }) => {
  return (
    <div className="brutalist-card">
      <div className="brutalist-card__header">
        <div className="brutalist-card__icon">
          {/* You can add an icon here if you have one */}
        </div>
        <div className="brutalist-card__alert">{eventName}</div>
      </div>
      <div className="brutalist-card__message">
        <ul>
          <li>Ticket ID: {ticketID}</li>
          <li>Date: {new Date(date).toLocaleDateString()}</li>
          <li>Venue: {location}</li>
          <li>Organizer: {organizerName}</li>
          {/* Add other details as needed */}
        </ul>
      </div>
      <div className="brutalist-card__actions">
        <button className="brutalist-card__button brutalist-card__button--mark" onClick={onView}>
          View Ticket
        </button>
        <button className="brutalist-card__button brutalist-card__button--read" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BookingCard;