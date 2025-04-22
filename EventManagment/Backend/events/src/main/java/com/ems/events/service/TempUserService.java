package com.ems.events.service;

import com.ems.events.entity.TempUser;
import java.util.List;

public interface TempUserService {
    TempUser createTempUser(TempUser tempUser);

    void approveTempUser(Long tempUserId);

    void disapproveTempUser(Long tempUserId); // Add this method

    List<TempUser> getAllTempUsers();
}