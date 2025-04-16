package com.ems.events.controller;

import com.ems.events.entity.Event;
import com.ems.events.service.EventServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    private EventServiceImpl eventService;

    @PostMapping("/manage/create")
    public Event createEvent(@Valid @RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @PutMapping("/manage/update/{eventId}")
    public Event updateEvent(@PathVariable Long eventId, @Valid @RequestBody Event event) {
        return eventService.updateEvent(eventId, event);
    }

    @DeleteMapping("/manage/delete/{eventId}")
    public String deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return "Event deleted successfully!";
    }

    @GetMapping("/view/all")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("view/{userid}")
    public Event getEventById(@PathVariable Long userid) {
        return eventService.getEventById(userid);
    }

    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUser(@PathVariable Long userId) {
        return eventService.getEventsByUser(userId);
    }

    @GetMapping("/category/{category}")
    public List<Event> getEventsByCategory(@PathVariable String category) {
        return eventService.getEventsByCategory(category);
    }

    @GetMapping("/upcoming")
    public List<Event> getUpcomingEvents() {
        return eventService.getUpcomingEvents();
    }

    @GetMapping("/past")
    public List<Event> getPastEvents() {
        return eventService.getPastEvents();
    }

}
