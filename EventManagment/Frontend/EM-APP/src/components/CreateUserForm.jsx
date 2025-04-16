import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CreateUserForm = ({ open, onCancel, onSave }) => {
  const [userDetails, setUserDetails] = useState({
    userName: '',
    email: '',
    contactNumber: '',
    password: '',
  });

  const handleChange = (field, value) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(userDetails);
  };

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={userDetails.userName}
          onChange={(e) => handleChange('userName', e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={userDetails.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        <TextField
          label="Contact Number"
          fullWidth
          margin="normal"
          value={userDetails.contactNumber}
          onChange={(e) => handleChange('contactNumber', e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={userDetails.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserForm;