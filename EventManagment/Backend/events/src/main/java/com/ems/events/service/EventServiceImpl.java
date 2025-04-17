package com.ems.events.service;

import com.ems.events.entity.Event;
import com.ems.events.entity.User;
import com.ems.events.exception.EventNotFoundException;
import com.ems.events.exception.UserNotFoundException;
import com.ems.events.repo.EventRepository;
import com.ems.events.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventServiceImpl {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationServiceImpl notificationService;

    public Event createEvent(Event event) {
        // Get the currently authenticated user's username
        String username = getAuthenticatedUsername();

        // Fetch the user from the database
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Associate the user with the event
        event.setUser(user);
        event.setActive(true);

        // Save the event
        Event savedEvent = eventRepository.save(event);

        // Notify users about the new event
        notificationService.notifyAllUsersAboutNewEvent(savedEvent);

        return savedEvent;
    }

    private String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    public Event updateEvent(Long eventId, Event eventDetails) {
        Event existingEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        existingEvent.setName(eventDetails.getName());
        existingEvent.setCategory(eventDetails.getCategory());
        existingEvent.setLocation(eventDetails.getLocation());
        existingEvent.setDate(eventDetails.getDate());
        Event updatedEvent = eventRepository.save(existingEvent);

        notificationService.notifyAllUsersAboutEventUpdate(updatedEvent);

        return updatedEvent;
    }

    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        event.setActive(false);
        eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findByIsActiveTrue();
    }

    public Event getEventById(Long eventId) {
        return eventRepository.findByEventIdAndIsActiveTrue(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
    }

    public List<Event> getEventsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found");
        }
        return eventRepository.findByUserUserIdAndIsActiveTrue(userId);
    }

    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategoryAndIsActiveTrue(category);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateAfterAndIsActiveTrue(LocalDateTime.now());
    }

    public List<Event> getPastEvents() {
        return eventRepository.findByDateBeforeAndIsActiveTrue(LocalDateTime.now());
    }

    public List<Event> searchEventsByName(String query) {
        return eventRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(query);
    }
}