package com.ems.events.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ems.events.entity.Notification;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUserIdAndIsActiveTrue(Long userId);
    List<Notification> findByEventEventIdAndIsActiveTrue(Long eventId);
    List<Notification> findByIsActiveTrue();
}
