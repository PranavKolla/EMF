package com.ems.events.controller;

import com.ems.events.entity.TempUser;
import com.ems.events.service.TempUserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/organizer")
public class TempUserController {

    @Autowired
    private TempUserService tempUserService;

    // API to register a TempUser
    @PostMapping("/create")
    public TempUser createTempUser(@Valid @RequestBody TempUser tempUser) {
        tempUser.setRole("ORGANIZER"); // Set default role as "ORGANIZER"
        return tempUserService.createTempUser(tempUser);
    }

    // API to approve a TempUser
    @PostMapping("/admin/approve/{tempUserId}")
    public String approveTempUser(@PathVariable Long tempUserId) {
        tempUserService.approveTempUser(tempUserId);
        return "TempUser approved and moved to User table successfully.";
    }

    // API to disapprove a TempUser
    @DeleteMapping("/admin/disapprove/{tempUserId}")
    public String disapproveTempUser(@PathVariable Long tempUserId) {
        tempUserService.disapproveTempUser(tempUserId);
        return "TempUser disapproved and removed successfully.";
    }

    @GetMapping("/all")
    public List<TempUser> getAllTempUsers() {
        return tempUserService.getAllTempUsers();
    }
}