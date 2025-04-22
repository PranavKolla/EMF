import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Import Navbar
import "./css/AdminDashboard.css"; // Import the CSS file
import axios from "axios"; // Import Axios

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Retrieve the token from localStorage
  const token = localStorage.getItem("jwtToken");

  // Fetch all organizers from the API
  const fetchOrganizers = async () => {
    try {
      const response = await axios.get("http://localhost:9090/organizer/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrganizers(response.data);
    } catch (error) {
      console.error("Error fetching organizers:", error);
      setErrorMessage(`Failed to fetch organizers: ${error.response?.data?.message || error.message}`);
    }
  };

  // Approve an organizer
  const handleApprove = async (tempUserId) => {
    try {
      await axios.post(
        `http://localhost:9090/organizer/admin/approve/${tempUserId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Organizer approved successfully!");
      setOrganizers((prevOrganizers) =>
        prevOrganizers.filter((organizer) => organizer.tempUserId !== tempUserId)
      ); // Remove the approved organizer from the list
    } catch (error) {
      console.error("Error approving organizer:", error);
      setErrorMessage(`Failed to approve organizer: ${error.response?.data?.message || error.message}`);
    }
  };

  // Disapprove an organizer
  const handleDisapprove = async (tempUserId) => {
    if (window.confirm("Are you sure you want to disapprove this organizer?")) {
      try {
        await axios.delete(`http://localhost:9090/organizer/admin/disapprove/${tempUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSuccessMessage("Organizer disapproved and removed successfully!");
        setOrganizers((prevOrganizers) =>
          prevOrganizers.filter((organizer) => organizer.tempUserId !== tempUserId)
        ); // Remove the disapproved organizer from the list
      } catch (error) {
        console.error("Error disapproving organizer:", error);
        setErrorMessage(`Failed to disapprove organizer: ${error.response?.data?.message || error.message}`);
      }
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
              <button
                className="disapprove-button"
                onClick={() => handleDisapprove(organizer.tempUserId)}
              >
                Disapprove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;