package com.ems.events.service;

import com.ems.events.entity.User;
import com.ems.events.exception.UserAlreadyExistsException;
import com.ems.events.exception.UserNotFoundException;
import com.ems.events.repo.UserRepository;
import com.ems.events.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User createUser(User user) throws UserAlreadyExistsException {
        if (userRepository.existsByUserName(user.getUserName())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }
        if (userRepository.existsByContactNumber(user.getContactNumber())) {
            throw new UserAlreadyExistsException("Contact number already exists");
        }

        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
public User updateUser(Long id, User updatedUser) throws UserNotFoundException, UserAlreadyExistsException {
    User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    // Check if the new email exists in the database for a different user
    if (!existingUser.getEmail().equals(updatedUser.getEmail()) &&
            userRepository.existsByEmail(updatedUser.getEmail())) {
        User userWithEmail = userRepository.findByEmail(updatedUser.getEmail())
                .orElse(null);
        if (userWithEmail != null && !userWithEmail.getUserId().equals(id)) {
            throw new UserAlreadyExistsException("Email already exists");
        }
    }

    // Check if the new contact number exists in the database for a different user
    if (!existingUser.getContactNumber().equals(updatedUser.getContactNumber()) &&
            userRepository.existsByContactNumber(updatedUser.getContactNumber())) {
        User userWithContact = userRepository.findByContactNumber(updatedUser.getContactNumber())
                .orElse(null);
        if (userWithContact != null && !userWithContact.getUserId().equals(id)) {
            throw new UserAlreadyExistsException("Contact number already exists");
        }
    }

    // Update the user details
    existingUser.setUserName(updatedUser.getUserName());
    existingUser.setEmail(updatedUser.getEmail());
    existingUser.setContactNumber(updatedUser.getContactNumber());

    // Only update the password if it is provided and not empty
    if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
        existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
    }

    return userRepository.save(existingUser);
}
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long userId) throws UserNotFoundException {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        // Fetch the user from the database
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Convert the user's role to Spring Security's GrantedAuthority format
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());

        // Return an instance of CustomUserDetails
        return new CustomUserDetails(
                user.getUserId(), // Include userId
                user.getUserName(),
                user.getPassword(),
                Collections.singletonList(authority) // Use role as a GrantedAuthority
        );
    }
}