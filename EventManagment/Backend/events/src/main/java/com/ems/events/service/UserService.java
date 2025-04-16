package com.ems.events.service;

import com.ems.events.entity.User;
import com.ems.events.exception.UserAlreadyExistsException;
import com.ems.events.exception.UserNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UserService {
    User createUser(User user) throws UserAlreadyExistsException;

    User updateUser(Long id, User updatedUser) throws UserNotFoundException, UserAlreadyExistsException;

    List<User> getAllUsers();

    User getUserById(Long userId) throws UserNotFoundException;

    UserDetails loadUserByUsername(String username);
}