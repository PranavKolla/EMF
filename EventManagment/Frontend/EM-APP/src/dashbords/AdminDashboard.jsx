import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import CreateUserForm from '../components/CreateUserForm'; // Importing the CreateUserForm component

const AdminDashboard = () => {
  const [openUserForm, setOpenUserForm] = useState(false); // State to control the user form dialog
  const [error, setError] = useState(null);

  const handleOpenForm = () => {
    setOpenUserForm(true);
  };

  const handleSaveUser = (userDetails) => {
    const token = localStorage.getItem('jwtToken');

    // Prepare the request body
    const organizerData = {
      userName: userDetails.userName,
      email: userDetails.email,
      contactNumber: userDetails.contactNumber,
      password: userDetails.password,
    };

    // Call the API to create an organizer
    fetch('http://localhost:9090/users/create/organizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(organizerData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setOpenUserForm(false); // Close the form dialog
      })
      .catch((error) => {
        setError(`Failed to create organizer: ${error.message}`);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome, Admin! Manage users and events here.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenForm}>
        Add Organizer
      </Button>

      {/* Create User Form Dialog */}
      <CreateUserForm
        open={openUserForm}
        onCancel={() => setOpenUserForm(false)}
        onSave={handleSaveUser}
      />

      {error && (
        <Typography variant="body2" color="error" style={{ marginTop: '20px' }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default AdminDashboard;