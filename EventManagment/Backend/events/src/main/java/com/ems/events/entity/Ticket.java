package com.ems.events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @SuppressWarnings("deprecation")
    @Id
    @GeneratedValue(generator = "ticket-id-gen")
    @GenericGenerator(name = "ticket-id-gen", strategy = "com.ems.events.generator.TicketIdGenerator")
    private String ticketID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore  
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore  
    private User user;

    @NotNull(message = "Booking date is required")
    private LocalDateTime bookingDate;

    @NotBlank(message = "Status cannot be empty")
    private String status;

   private boolean isActive = true;  
}
