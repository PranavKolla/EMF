import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import './css/EventFormDialog.css'; // Ensure the path is correct

const EventFormDialog = ({ open, isCreating, selectedEvent, onChange, onCancel, onSave }) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle className="dialog-title">
        {isCreating ? 'Create Event' : 'Update Event'}
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            fullWidth
            value={selectedEvent?.name || ''}
            onChange={(e) => onChange({ ...selectedEvent, name: e.target.value })}
          />
          <TextField
            label="Category"
            fullWidth
            value={selectedEvent?.category || ''}
            onChange={(e) => onChange({ ...selectedEvent, category: e.target.value })}
          />
          <TextField
            label="Location"
            fullWidth
            value={selectedEvent?.location || ''}
            onChange={(e) => onChange({ ...selectedEvent, location: e.target.value })}
          />
          <TextField
            label="Date"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedEvent?.date || ''}
            onChange={(e) => onChange({ ...selectedEvent, date: e.target.value })}
          />
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={onCancel} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventFormDialog;