import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

const EventCard = ({ event, onUpdate, onDelete }) => {
  return (
    <Card key={event.eventId} className="card">
      {event.isActive && <div className="activeDot"></div>}
      <CardContent className="cardContent">
        <Typography variant="h5">{event.name}</Typography>
        <Typography variant="body1">Category: {event.category}</Typography>
        <Typography variant="body1">Location: {event.location}</Typography>
        <Typography variant="body1">Date: {new Date(event.date).toLocaleString()}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={() => onUpdate(event)}>
          Update
        </Button>
        <Button variant="contained" color="secondary" onClick={() => onDelete(event.eventId)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;