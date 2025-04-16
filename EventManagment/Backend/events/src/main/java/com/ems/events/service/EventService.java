package com.ems.events.service;

import com.ems.events.entity.Event;
// import com.ems.events.entity.User;
import com.ems.events.exception.EventNotFoundException;

import com.ems.events.exception.UserNotFoundException;
// import com.ems.events.repo.EventRepository;
// import com.ems.events.repo.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
import java.util.List;


public interface EventService{   
    
    Event createEvent(Event event) throws UserNotFoundException;

	Event updateEvent(Long eventId, Event eventDetails) throws EventNotFoundException;

	void deleteEvent(Long eventId) throws EventNotFoundException;

	List<Event> getAllEvents();

	Event getEventById(Long eventId) throws EventNotFoundException;

	List<Event> getEventsByUser(Long userId) throws UserNotFoundException;

	List<Event> getEventsByCategory(String category);

	List<Event> getUpcomingEvents();

	List<Event> getPastEvents();

	List<Event> searchEventsByName(String query);
}

