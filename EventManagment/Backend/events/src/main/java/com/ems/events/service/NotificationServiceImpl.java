package com.ems.events.service;

import com.ems.events.entity.Event;
import com.ems.events.entity.Notification;
import com.ems.events.entity.User;
import com.ems.events.exception.EventNotFoundException;
import com.ems.events.exception.NotificationNotFoundException;
//import com.ems.events.exception.UserNotFoundException;
import com.ems.events.repo.EventRepository;
import com.ems.events.repo.NotificationRepository;
import com.ems.events.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl  {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public void notifyAllUersAboutNewEvent(Event event) {
        List<User> users = userRepository.findAll();
        String message = "New Event Created: " + event.getName() + " at " + event.getLocation();
        for (User user : users) {
            createNotification(user, event, message);
        }
    }

    public void notifyAllUsersAboutEventUpdate(Event event) {
        List<User> users = userRepository.findAll();
        String message = "Event Updated: " + event.getName() + " - Check details.";
        for (User user : users) {
            createNotification(user, event, message);
        }
    }

    public void sendReminderToTicketHolders(Event event, String message) {
        List<User> ticketHolders = userRepository.findAll(); 
        for (User user : ticketHolders) {
            createNotification(user, event, message);
        }
    }

    @Scheduled(fixedRate = 60000)
    public void sendAutomaticEventReminders() {
        List<Event> events = eventRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Event event : events) {
            LocalDateTime eventTime = event.getDate();
            if (eventTime.minusMinutes(60).isBefore(now) && eventTime.minusMinutes(60).isAfter(now.minusMinutes(1))) {
                sendReminderToTicketHolders(event, "Reminder: " + event.getName() + " starts in 1 hour!");
            }
            if (eventTime.minusMinutes(30).isBefore(now) && eventTime.minusMinutes(30).isAfter(now.minusMinutes(1))) {
                sendReminderToTicketHolders(event, "Reminder: " + event.getName() + " starts in 30 minutes!");
            }
        }
    }
    
    @Scheduled(fixedRate = 60000)
    public void sendFeedbackReminders() {
        List<Event> events = eventRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Event event : events) {
            if (event.getDate().plusMinutes(10).isBefore(now) && event.getDate().plusMinutes(10).isAfter(now.minusMinutes(1))) {
                sendReminderToTicketHolders(event, "Reminder: Please share your feedback for " + event.getName());
            }
        }
    }

    public void sendManualFeedbackReminder(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        sendReminderToTicketHolders(event, "Reminder: Please share your feedback for " + event.getName());
    }

    public Notification createNotification(User user, Event event, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .event(event)
                .message(message)
                .sentTimestamp(LocalDateTime.now())
                .isActive(true)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findByIsActiveTrue();
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserUserIdAndIsActiveTrue(userId);
    }

    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found"));
        notification.setActive(false);
        notificationRepository.save(notification);
    }
    

    
}
