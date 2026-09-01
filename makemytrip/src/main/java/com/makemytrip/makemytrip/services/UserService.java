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

    public User signup(User user) {

        Optional<User> existingEmail = userRepository.findByEmail(user.getEmail());

        if (existingEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Optional<User> existingPhone = userRepository.findByPhoneNumber(user.getPhoneNumber());

        if (existingPhone.isPresent()) {
            throw new RuntimeException("Phone Number already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }
        return user;
    }
    
    public User editprofile(Long id, User updateUser) {
    	
    	User user = userRepository.findById(id).orElse(null);
    	if(user != null) {
    		user.setFirstName(updateUser.getFirstName());
    		user.setLastName(updateUser.getLastName());
    		user.setPhoneNumber(updateUser.getPhoneNumber());
    		return userRepository.save(user);
    	}
		return null;
    }
}