package com.ems.events.controller;

import com.ems.events.entity.TempUser;
import com.ems.events.service.TempUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/organizer")
public class TempUserController {

    private static final Logger logger = LoggerFactory.getLogger(TempUserController.class);

    @Autowired
    private TempUserService tempUserService;

    @PostMapping("/create")
    public TempUser createTempUser(@Valid @RequestBody TempUser tempUser) {
        logger.info("Creating TempUser with username: {}", tempUser.getUserName());
        return tempUserService.createTempUser(tempUser);
    }

    @PostMapping("/admin/approve/{tempUserId}")
    public String approveTempUser(@PathVariable Long tempUserId) {
        logger.info("Approving TempUser with ID: {}", tempUserId);
        tempUserService.approveTempUser(tempUserId);
        return "TempUser approved and moved to User table successfully.";
    }

    @DeleteMapping("/admin/disapprove/{tempUserId}")
    public String disapproveTempUser(@PathVariable Long tempUserId) {
        logger.info("Disapproving TempUser with ID: {}", tempUserId);
        tempUserService.disapproveTempUser(tempUserId);
        return "TempUser disapproved and removed successfully.";
    }

    @GetMapping("/all")
    public List<TempUser> getAllTempUsers() {
        logger.info("Fetching all TempUsers");
        return tempUserService.getAllTempUsers();
    }
}