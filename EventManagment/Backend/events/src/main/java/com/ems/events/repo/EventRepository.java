package com.ems.events.repo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ems.events.entity.Event;
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByIsActiveTrue();
    Optional<Event> findByEventIdAndIsActiveTrue(Long eventId);
    List<Event> findByUserUserIdAndIsActiveTrue(Long userId);
    List<Event> findByCategoryAndIsActiveTrue(String category);
    List<Event> findByDateAfterAndIsActiveTrue(LocalDateTime date);
    List<Event> findByDateBeforeAndIsActiveTrue(LocalDateTime date);
    List<Event> findByNameContainingIgnoreCaseAndIsActiveTrue(String query);
}
