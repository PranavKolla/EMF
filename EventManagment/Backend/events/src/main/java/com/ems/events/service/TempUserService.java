package com.ems.events.service;

import com.ems.events.entity.TempUser;
import java.util.List;

public interface TempUserService {
    TempUser createTempUser(TempUser tempUser);
    void approveTempUser(Long tempUserId);
    List<TempUser> getAllTempUsers(); // New method
}