package com.ems.events.controller;

import com.ems.events.entity.Feedback;
import com.ems.events.service.FeedbackService;
import com.ems.events.service.NotificationServiceImpl;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;
    
    @Autowired
    private NotificationServiceImpl notificationService;

    @PostMapping("/submit")
    public Feedback submitFeedback(
            @RequestParam Long eventId,
            @RequestParam Long userId,
            @RequestParam String message,
            @RequestParam int rating) {
        return feedbackService.submitFeedback(eventId, userId, message, rating);
    }

    @GetMapping("/event/{eventId}")
    public List<Feedback> getFeedbackByEvent(@PathVariable Long eventId) {
        return feedbackService.getFeedbackByEvent(eventId);
    }

    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbackByUser(@PathVariable Long userId) {
        return feedbackService.getFeedbackByUser(userId);
    }

    @DeleteMapping("/{feedbackId}")
    public String deleteFeedback(@PathVariable Long feedbackId) {
        return feedbackService.deleteFeedback(feedbackId);
    }

    @GetMapping("/event/{eventId}/rating")
    public Optional<Double> getAverageRatingForEvent(@PathVariable Long eventId) {
        return feedbackService.getAverageRatingForEvent(eventId);
    }

    @GetMapping("/event/{eventId}/reminder")
    public String sendManualFeedbackReminder(@PathVariable Long eventId) {
        notificationService.sendManualFeedbackReminder(eventId);
        return "Feedback reminder sent to ticket holders.";
    }
}
