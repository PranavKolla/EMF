package com.ems.events.repo;

import com.ems.events.entity.TempUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TempUserRepository extends JpaRepository<TempUser, Long> {
    boolean existsByEmail(String email);
    boolean existsByUserName(String userName);
    boolean existsByContactNumber(String contactNumber);
}