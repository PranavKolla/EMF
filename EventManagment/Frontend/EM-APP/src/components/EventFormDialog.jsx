import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EventFormDialog = ({ open, isCreating, selectedEvent, onChange, onCancel, onSave }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{isCreating ? 'Create Event' : 'Update Event'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={selectedEvent?.name || ''}
          onChange={(e) => onChange({ ...selectedEvent, name: e.target.value })}
        />
        <TextField
          label="Category"
          fullWidth
          margin="normal"
          value={selectedEvent?.category || ''}
          onChange={(e) => onChange({ ...selectedEvent, category: e.target.value })}
        />
        <TextField
          label="Location"
          fullWidth
          margin="normal"
          value={selectedEvent?.location || ''}
          onChange={(e) => onChange({ ...selectedEvent, location: e.target.value })}
        />
        <TextField
          label="Date"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={selectedEvent?.date || ''}
          onChange={(e) => onChange({ ...selectedEvent, date: e.target.value })}
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

export default EventFormDialog;