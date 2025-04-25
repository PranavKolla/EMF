package com.ems.events.controller;

import com.ems.events.dto.CreateUserDTO;
import com.ems.events.dto.UpdateUserDTO;
import com.ems.events.entity.User;
import com.ems.events.security.CustomUserDetails;
import com.ems.events.security.JwtUtil;
import com.ems.events.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    // Create an attendee
    @PostMapping("/create")
    public User createAttendee(@Valid @RequestBody CreateUserDTO createUserDTO) {
        logger.info("Creating attendee with username: {}", createUserDTO.getUserName());
        User user = new User();
        user.setUserName(createUserDTO.getUserName());
        user.setEmail(createUserDTO.getEmail());
        user.setPassword(createUserDTO.getPassword());
        user.setContactNumber(createUserDTO.getContactNumber());
        user.setRole("ATTENDEE"); // Assign "ATTENDEE" role
        return userService.createUser(user);
    }

    /*// Create an organizer
    @PostMapping("/create/organizer")
    public User createOrganizer(@Valid @RequestBody CreateUserDTO createUserDTO) {
        User user = new User();
        user.setUserName(createUserDTO.getUserName());
        user.setEmail(createUserDTO.getEmail());
        user.setPassword(createUserDTO.getPassword());
        user.setContactNumber(createUserDTO.getContactNumber());
        user.setRole("ORGANIZER"); // Assign "ORGANIZER" role
        return userService.createUser(user);
    }*/

   /* // Create an admin
    @PostMapping("/create/admin")
    public User createAdmin(@Valid @RequestBody CreateUserDTO createUserDTO) {
        User user = new User();
        user.setUserName(createUserDTO.getUserName());
        user.setEmail(createUserDTO.getEmail());
        user.setPassword(createUserDTO.getPassword());
        user.setContactNumber(createUserDTO.getContactNumber());
        user.setRole("ADMIN"); // Assign "ADMIN" role
        return userService.createUser(user);
    }
*/
    // Update a user
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserDTO updateUserDTO) {
        logger.info("Updating user with ID: {}", id);
        User user = new User();
        user.setUserName(updateUserDTO.getUserName());
        user.setEmail(updateUserDTO.getEmail());
        user.setPassword(updateUserDTO.getPassword()); // Optional
        user.setContactNumber(updateUserDTO.getContactNumber());
        return userService.updateUser(id, user);
    }

    // Get all users
    @GetMapping("/all")
    public List<User> getAllUsers() {
        logger.info("Fetching all users");
        return userService.getAllUsers();
    }

    // Get a user by ID
    @GetMapping("/{userid}")
    public User getUserById(@PathVariable Long userid) {
        logger.info("Fetching user with ID: {}", userid);
        return userService.getUserById(userid);
    }

    // Login endpoint to generate JWT token
    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String username, @RequestParam String password) {
        logger.info("User login attempt with username: {}", username);
        // Authenticate the user
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        // Load user details
        CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByUsername(username);

        // Extract userId and role
        Long userId = userDetails.getUserId();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        // Generate the JWT token
        String token = jwtUtil.generateToken(userDetails.getUsername(), role, userId);

        logger.info("User login successful for username: {}", username);

        // Prepare the response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);

        return response;
    }
}
