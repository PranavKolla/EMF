import React, { useEffect, useState } from 'react';
import './css/Notification.css';
import { X as CloseIcon } from 'react-feather'; // Import a close icon

const Notification = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('jwtToken');
      const userId = JSON.parse(atob(token.split('.')[1])).userId; // Decode userId from JWT

      try {
        const response = await fetch(`http://localhost:9090/notifications/usernotify/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-popup">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button className="close-button" onClick={onClose}>
          <CloseIcon size={20} />
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="notification-list">
          {/* Display only the last 5 notifications */}
          {notifications.slice(-5).reverse().map((notification) => (
            <li key={notification.notificationId} className="notification-item">
              <p>{notification.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;