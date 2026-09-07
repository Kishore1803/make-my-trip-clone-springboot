package com.makemytrip.makemytrip.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.User;
import com.makemytrip.makemytrip.services.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        return ResponseEntity.ok(userService.signup(user));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        return ResponseEntity.ok(userService.login(user.getEmail(),user.getPassword()));
    }

    // EDIT PROFILE
    @PutMapping("/edit/{id}")
    public ResponseEntity<User> editProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.editprofile(id, updatedUser));
    }
}