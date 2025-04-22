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
        tempUser.setPassword(passwordEncoder.encode(tempUser.getPassword())); // Encode password
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