package com.makemytrip.makemytrip.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.User;
import com.makemytrip.makemytrip.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // SIGNUP
    public User signup(User user) {

        Optional<User> existingEmail = userRepository.findByEmail(user.getEmail());

        if (existingEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Optional<User> existingPhone = userRepository.findByPhoneNumber(user.getPhoneNumber());

        if (existingPhone.isPresent()) {
            throw new RuntimeException("Phone Number already exists");
        }

        // Encode password only during signup
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Every public signup is a normal USER
        user.setRole("USER");

        return userRepository.save(user);
    }

    // LOGIN
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email) 
        		.orElseThrow(() -> new RuntimeException("User not found"));

        // Compare raw password with encrypted database password
        if (!passwordEncoder.matches(password,user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        // Fix old users whose role may be null
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
            userRepository.save(user);
        }
        return user;
    }

    // EDIT PROFILE
    public User editprofile(Long id, User updateUser) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(updateUser.getFirstName());
        user.setLastName(updateUser.getLastName());
        user.setEmail(updateUser.getEmail());
        user.setPhoneNumber(updateUser.getPhoneNumber());

        return userRepository.save(user);
    }
}