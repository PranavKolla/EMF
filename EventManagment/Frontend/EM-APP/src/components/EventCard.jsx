import React from 'react';
import './css/EventCard.css'; 

const EventCard = ({ eventName, category, date, location, userName, rating, onBook }) => {
  return (
    <div className="card">
      <div className="card-rating">{rating ? `${rating} ★` : "No Rating"}</div>
      <div className="card-content-wrapper">
        <div className="card-title">{eventName}</div>
        <div className="card-subtitle">{category}</div>
        <div className="card-subtitle">Details:</div>
        <ul className="card-details">
          <li>Date: {date}</li>
          <li>Venue: {location}</li>
          <li>Organizer: {userName}</li>
        </ul>
      </div>
      <button className="card-btn" onClick={onBook}>Book</button>
    </div>
  );
};

export default EventCard;