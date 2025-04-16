package com.ems.events.controller;

import com.ems.events.entity.Ticket;
import com.ems.events.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {
    @Autowired
    private TicketService ticketService;

    @PostMapping("/book")
    public Ticket bookTicket(@RequestParam Long eventId, @RequestParam Long userId) {
        return ticketService.bookTicket(eventId, userId);
    }

    @GetMapping("/view")
    public List<Ticket> viewTickets() {
        return ticketService.viewTickets();
    }

    @PutMapping("/cancel/{ticketID}")
    public String cancelTicket(@PathVariable String ticketID) {
        return ticketService.cancelTicket(ticketID);
    }

    @GetMapping("/eventTicket/{eventID}")
    public List<Ticket> getAllByEventID(@PathVariable Long eventID) {
        return ticketService.getAllByEventID(eventID);
    }

    @GetMapping("/userTicket/{userID}")
    public List<Ticket> getAllByUserID(@PathVariable Long userID) {
        return ticketService.getAllByUserID(userID);
    }

    @GetMapping("/view/cancelled")
    public List<Ticket> viewCancelledTickets() {
        return ticketService.viewCancelledTickets();
    }
}
