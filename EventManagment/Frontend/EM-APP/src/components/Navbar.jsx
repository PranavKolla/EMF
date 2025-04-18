import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Navbar.css';
import { Bell as NotificationsIcon, User as UserIcon } from 'react-feather';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const userInfoRef = useRef(null);
  const userSectionRef = useRef(null); // Ref for the user-section div
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub || 'User');
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const fetchUserDetails = async () => {
    setIsUserInfoOpen(!isUserInfoOpen); // Toggle the open state
    if (!isUserInfoOpen && !userDetails) { // Fetch only if opening and details are not already fetched
      setLoadingDetails(true);
      setUserDetails(null);
      setErrorDetails('');
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`http://localhost:9090/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch user details: ${response.status} - ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        setUserDetails(data);
        setLoadingDetails(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setErrorDetails(error.message);
        setLoadingDetails(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const closeUserInfo = (e) => {
    if (userSectionRef.current && !userSectionRef.current.contains(e.target)) {
      setIsUserInfoOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeUserInfo);
    return () => {
      document.removeEventListener('mousedown', closeUserInfo);
    };
  }, [isUserInfoOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">Your App Name</Link>
      </div>
      <ul className="navbar-menu">
        <li className="nav-item">
          <Link to="/home" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/events" className="nav-link">Events</Link>
        </li>
        <li className="nav-item">
          <Link to="/bookings" className="nav-link">Bookings</Link>
        </li>
        <li className="nav-item">
          <Link to="/feedback" className="nav-link">Feedback</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        <button className="action-button notification-button">
          <NotificationsIcon size={24} color="#f8f8f2" />
        </button>
        <div className={`user-section ${isUserInfoOpen ? 'active' : ''}`} ref={userSectionRef}>
          <button className="action-button user-button" onClick={fetchUserDetails}>
            <UserIcon size={24} color="#f8f8f2" className="user-icon" />
            <span className="username">{username || 'User'}</span>
          </button>
          {isUserInfoOpen && (
            <div className="user-info-popup" ref={userInfoRef}>
              {loadingDetails && <div className="loading">Loading...</div>}
              {errorDetails && <div className="error">{errorDetails}</div>}
              {userDetails && (
                <div>
                  <p>Username: {userDetails.userName}</p>
                  <p>Email: {userDetails.email}</p>
                  <p>Contact: {userDetails.contactNumber}</p>
                </div>
              )}
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;