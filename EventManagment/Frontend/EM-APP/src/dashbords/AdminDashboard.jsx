import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Button, Grid } from "@mui/material";

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Retrieve the token from localStorage
  const token = localStorage.getItem("jwtToken");
  console.log("Token:", token);

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
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      {successMessage && <Typography style={{ color: "green" }}>{successMessage}</Typography>}
      {errorMessage && <Typography style={{ color: "red" }}>{errorMessage}</Typography>}
      <Grid container spacing={3}>
        {organizers.map((organizer) => (
          <Grid item xs={12} sm={6} md={4} key={organizer.tempUserId}>
            <Card>
              <CardContent>
                <Typography variant="h6">{organizer.userName}</Typography>
                <Typography>Email: {organizer.email}</Typography>
                <Typography>Contact: {organizer.contactNumber}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApprove(organizer.tempUserId)}
                  style={{ marginTop: "10px" }}
                >
                  Approve
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;