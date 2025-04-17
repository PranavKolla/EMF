package com.ems.events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class TempUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tempUserId;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false)
    private String userName;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, max = 60, message = "Password must be between 6 and 20 characters")
    private String password;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;

    @Pattern(regexp = "^\\d{10}$", message = "Contact number must be exactly 10 digits")
    @NotBlank(message = "Contact number cannot be empty")
    @Column(unique = true)
    private String contactNumber;

    @Column(nullable = false)
    @JsonIgnore
    private String role; // Role of the user (e.g., "ORGANIZER")

    @Column(nullable = false)
    private boolean approved = false; // Approval status
}