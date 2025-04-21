import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Import Navbar
import "./css/AdminDashboard.css"; // Import the CSS file

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Retrieve the token from localStorage
  const token = localStorage.getItem("jwtToken");

  // Fetch all organizers from the API
  const fetchOrganizers = async () => {
    try {
      const response = await fetch("http://localhost:9090/organizer/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrganizers(data);
    } catch (error) {
      setErrorMessage(`Failed to fetch organizers: ${error.message}`);
    }
  };

  // Approve an organizer
  const handleApprove = async (tempUserId) => {
    try {
      const response = await fetch(`http://localhost:9090/organizer/admin/approve/${tempUserId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccessMessage("Organizer approved successfully!");
      setOrganizers((prevOrganizers) =>
        prevOrganizers.filter((organizer) => organizer.tempUserId !== tempUserId)
      ); // Remove the approved organizer from the list
    } catch (error) {
      setErrorMessage(`Failed to approve organizer: ${error.message}`);
    }
  };

  // Fetch organizers on component mount
  useEffect(() => {
    fetchOrganizers();
  }, [token]);

  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <div className="admin-dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="organizers-grid">
          {organizers.map((organizer) => (
            <div className="organizer-card" key={organizer.tempUserId}>
              <h3>{organizer.userName}</h3>
              <p>Email: {organizer.email}</p>
              <p>Contact: {organizer.contactNumber}</p>
              <button
                className="approve-button"
                onClick={() => handleApprove(organizer.tempUserId)}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;