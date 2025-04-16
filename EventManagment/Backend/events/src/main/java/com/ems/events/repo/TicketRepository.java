package com.ems.events.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ems.events.entity.Ticket;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, String> {
    List<Ticket> findByEventEventIdAndIsActiveTrue(long eventId);
    List<Ticket> findByUserUserIdAndIsActiveTrue(long userId);
    List<Ticket> findByStatusAndIsActiveTrue(String status); 
    List<Ticket> findByStatusAndIsActiveFalse(String status); 
    boolean existsByUserUserIdAndEventEventIdAndIsActiveTrue(Long userId, Long eventId);
    long countByEventEventId(Long eventId);
}
