package com.ems.events.service;

import com.ems.events.entity.TempUser;
import com.ems.events.entity.User;
import com.ems.events.exception.UserNotFoundException;
import com.ems.events.repo.TempUserRepository;
import com.ems.events.repo.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class TempUserServiceImpl implements TempUserService {

    @Autowired
    private TempUserRepository tempUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public TempUser createTempUser(TempUser tempUser) {
        // Automatically set the role to "ORGANIZER"
        tempUser.setRole("ORGANIZER");

        // Check if the username already exists in TempUser or User tables
        if (tempUserRepository.existsByUserName(tempUser.getUserName()) || userRepository.existsByUserName(tempUser.getUserName())) {
            throw new IllegalArgumentException("Username already exists in the system.");
        }

        // Check if the email already exists in TempUser or User tables
        if (tempUserRepository.existsByEmail(tempUser.getEmail()) || userRepository.existsByEmail(tempUser.getEmail())) {
            throw new IllegalArgumentException("Email already exists in the system.");
        }

        // Check if the contact number already exists in TempUser or User tables
        if (tempUserRepository.existsByContactNumber(tempUser.getContactNumber()) || userRepository.existsByContactNumber(tempUser.getContactNumber())) {
            throw new IllegalArgumentException("Contact number already exists in the system.");
        }

        // Encode the password before saving
        tempUser.setPassword(passwordEncoder.encode(tempUser.getPassword()));

        return tempUserRepository.save(tempUser);
    }

    @Override
    public void approveTempUser(Long tempUserId) {
        TempUser tempUser = tempUserRepository.findById(tempUserId)
                .orElseThrow(() -> new UserNotFoundException("TempUser not found"));

        // Create a new User entity from TempUser
        User user = User.builder()
                .userName(tempUser.getUserName())
                .password(tempUser.getPassword())
                .email(tempUser.getEmail())
                .contactNumber(tempUser.getContactNumber())
                .role(tempUser.getRole())
                .build();

        // Save the user to the User table
        userRepository.save(user);

        // Delete the TempUser from the TempUser table
        tempUserRepository.delete(tempUser);
    }

    @Override
    public void disapproveTempUser(Long tempUserId) {
        TempUser tempUser = tempUserRepository.findById(tempUserId)
                .orElseThrow(() -> new UserNotFoundException("TempUser not found"));

        // Delete the TempUser from the TempUser table
        tempUserRepository.delete(tempUser);
    }

    @Override
    public List<TempUser> getAllTempUsers() {
        return tempUserRepository.findAll();
    }
}