package com.ems.events.service;

import com.ems.events.entity.*;
import com.ems.events.exception.EventNotFoundException;
import com.ems.events.exception.FeedbackNotFoundException;
import com.ems.events.exception.UserNotFoundException;
import com.ems.events.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackServiceImpl implements FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationServiceImpl notificationService;

    @Override
    @Transactional
    public Feedback submitFeedback(Long eventId, Long userId, String message, int rating) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!ticketRepository.existsByUserUserIdAndEventEventIdAndIsActiveTrue(userId, eventId)) {
            throw new RuntimeException("User has not booked a ticket for this event.");
        }

        Feedback feedback = Feedback.builder()
                .event(event)
                .user(user)
                .message(message)
                .rating(rating)
                .feedbackDate(LocalDateTime.now())
                .isActive(true)
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);

        List<Ticket> ticketHolders = ticketRepository.findByEventEventIdAndIsActiveTrue(eventId);
        for (Ticket ticket : ticketHolders) {
            notificationService.createNotification(
                    ticket.getUser(),
                    event,
                    "New feedback added for " + event.getName() + ": " + message
            );
        }

        return savedFeedback;
    }

    @Override
    public List<Feedback> getFeedbackByEvent(Long eventId) {
        return feedbackRepository.findByEventEventIdAndIsActiveTrue(eventId);
    }

    @Override
    public List<Feedback> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserUserIdAndIsActiveTrue(userId);
    }

    @Override
    @Transactional
    public String deleteFeedback(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new FeedbackNotFoundException("Feedback not found"));

        feedback.setActive(false);
        feedbackRepository.save(feedback);
        return "Feedback deleted successfully";
    }

    @Override
    public Optional<Double> getAverageRatingForEvent(Long eventId) {
        return feedbackRepository.findAverageRatingByEventId(eventId);
    }
}
