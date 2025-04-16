package com.ems.events.generator;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import com.ems.events.entity.Event;
import com.ems.events.entity.Ticket;

import java.io.Serializable;

public class TicketIdGenerator implements IdentifierGenerator {

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        String prefix = "";
        String suffix = "";

        try {
            // Assuming the object is of type Ticket
            Ticket ticket = (Ticket) object;
            Event event = ticket.getEvent();

            // Validate the event object
            if (event == null || event.getEventId() == null || event.getName() == null) {
                throw new IllegalStateException("Event information is required to generate Ticket ID");
            }

            // Extract the first three letters of the event name as the prefix
            prefix = event.getName().substring(0, 3).toUpperCase();

            Long ticketCount = session.createQuery(
                "SELECT COUNT(t) FROM Ticket t WHERE t.event.eventId = :eventId", Long.class)
                .setParameter("eventId", event.getEventId())
                .uniqueResult();

            // Generate a unique suffix (e.g., 0001, 0002, ...)
            if (ticketCount != null) {
                int count = ticketCount.intValue() + 1;
                suffix = String.format("%04d", count); // Zero-padded suffix
            }

        } catch (Exception e) {
            throw new HibernateException("Unable to generate ticket ID", e);
        }

        return prefix + suffix;
    }
}
