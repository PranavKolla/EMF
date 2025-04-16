package com.ems.events.service;

import com.ems.events.entity.Event;
import com.ems.events.entity.Notification;
import com.ems.events.entity.User;
import com.ems.events.exception.EventNotFoundException;
import com.ems.events.exception.NotificationNotFoundException;
// import com.ems.events.exception.UserNotFoundException;
// import com.ems.events.repo.EventRepository;
// import com.ems.events.repo.NotificationRepository;
// import com.ems.events.repo.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
import java.util.List;

public interface NotificationService {
	
	void notifyAllUserAboutNewEvent(Event event);

	void notifyAllUsersAboutEventUpdate(Event event);

	void sendReminderToTicketHolders(Event event, String message);

	void sendAutomaticEventReminders();

	void sendFeedbackReminders();

	void sendManualFeedbackReminder(Long eventId) throws EventNotFoundException;

	Notification createNotification(User user, Event event, String message);

	List<Notification> getAllNotifications();

	List<Notification> getNotificationsByUser(Long userId);

	void deleteNotification(Long notificationId) throws NotificationNotFoundException;
    
}
