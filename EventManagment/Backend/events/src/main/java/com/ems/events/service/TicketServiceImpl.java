package com.ems.events.service;

import com.ems.events.entity.Event;
import com.ems.events.entity.User;
import com.ems.events.entity.Ticket;
import com.ems.events.exception.EventNotFoundException;
import com.ems.events.exception.TicketNotFoundException;
import com.ems.events.exception.UserNotFoundException;
import com.ems.events.repo.EventRepository;
import com.ems.events.repo.UserRepository;
import com.ems.events.repo.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationServiceImpl notificationService;

    @Override
    @Transactional
    public Ticket bookTicket(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Ticket ticket = Ticket.builder()
                .event(event)
                .user(user)
                .bookingDate(LocalDateTime.now())
                .status("Booked")
                .isActive(true)
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        notificationService.createNotification(user, event, "Your ticket has been booked for " + event.getName());

        return savedTicket;
    }

    @Override
    public List<Ticket> viewTickets() {
        return ticketRepository.findByStatusAndIsActiveTrue("Booked");
    }

    @Override 
    @Transactional 
    public String cancelTicket(String ticketID) {
         Ticket ticket = ticketRepository.findById(ticketID) .orElseThrow(() -> new TicketNotFoundException("Ticket not found")); 
         ticket.setActive(false); 
         ticket.setStatus("Cancelled"); 
         ticketRepository.save(ticket); 
         notificationService.createNotification(ticket.getUser(), ticket.getEvent(), "Your ticket for " + ticket.getEvent().getName() + " has been cancelled."); 
         return "Cancelled Successfully"; 

}
    

    @Override
    public List<Ticket> getAllByEventID(Long eventId) {
        return ticketRepository.findByEventEventIdAndIsActiveTrue(eventId);
    }

    @Override
    public List<Ticket> getAllByUserID(Long userId) {
        return ticketRepository.findByUserUserIdAndIsActiveTrue(userId);
    }

    @Override
    public List<Ticket> viewCancelledTickets() {
        return ticketRepository.findByStatusAndIsActiveFalse("Cancelled");
    }
}

