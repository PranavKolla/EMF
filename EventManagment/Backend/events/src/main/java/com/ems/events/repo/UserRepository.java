package com.ems.events.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ems.events.entity.User;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByContactNumber(String contactNumber);
    Optional<User> findByEmail(String email);
    Optional<User> findByUserName(String userName);
    Optional<User> findByContactNumber(String contactNumber);
    

    // Fetch only users with the role "ORGANIZER"
    List<User> findByRole(String role);
    boolean existsByUserName(String userName);
}