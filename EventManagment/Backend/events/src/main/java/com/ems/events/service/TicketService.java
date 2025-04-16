package com.ems.events.service;

import com.ems.events.entity.Ticket;
import java.util.List;

public interface TicketService {
    Ticket bookTicket(Long eventId, Long userId);
    List<Ticket> viewTickets();
    String cancelTicket(String ticketID);
    List<Ticket> getAllByEventID(Long eventID);
    List<Ticket> getAllByUserID(Long userID);
    List<Ticket> viewCancelledTickets();
}
