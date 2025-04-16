import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const UserFormDialog = ({ open, selectedUser, onChange, onCancel, onSave }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={selectedUser?.userName || ''}
          onChange={(e) => onChange({ ...selectedUser, userName: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={selectedUser?.email || ''}
          onChange={(e) => onChange({ ...selectedUser, email: e.target.value })}
        />
        <TextField
          label="Contact Number"
          fullWidth
          margin="normal"
          value={selectedUser?.contactNumber || ''}
          onChange={(e) => onChange({ ...selectedUser, contactNumber: e.target.value })}
        />
        <TextField
          label="Password (Optional)"
          type="password"
          fullWidth
          margin="normal"
          value={selectedUser?.password || ''}
          onChange={(e) => onChange({ ...selectedUser, password: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;