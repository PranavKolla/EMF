package com.ems.events.service;
import com.ems.events.entity.Feedback;
import java.util.List;
import java.util.Optional;

public interface FeedbackService {
    Feedback submitFeedback(Long eventId, Long userId, String message, int rating);
    List<Feedback> getFeedbackByEvent(Long eventId);
    List<Feedback> getFeedbackByUser(Long userId);
    String deleteFeedback(Long feedbackId);
    Optional<Double> getAverageRatingForEvent(Long eventId);
}