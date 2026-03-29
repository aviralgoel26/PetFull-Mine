package com.petfull.backend.controller;

import com.petfull.backend.model.User;
import com.petfull.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin


public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {

        // 1. Check if email already exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(400).body("Email already registered");
        }

        // 2. Basic validation
        if (user.getPassword().length() < 6) {
            return ResponseEntity.status(400).body("Password must be at least 6 characters");
        }

        if (user.getFullName() == null || user.getFullName().length() < 3) {
            return ResponseEntity.status(400).body("Full name must be 3+ characters");
        }

        // 3. Save user
        userRepository.save(user);

        return ResponseEntity.ok("Registration successful");
    }
    @GetMapping("/test")
    public String test() {
        return "User API is working!";
    }
    @PostMapping("/login")
public ResponseEntity<?> loginuser(@RequestBody User loginData) {

    User existingUser = userRepository.findByEmail(loginData.getEmail());

    if (existingUser == null) {
        return ResponseEntity.status(400).body("User does not exist");
    }

    if (!existingUser.getPassword().equals(loginData.getPassword())) {
        return ResponseEntity.status(400).body("Incorrect Password");
    }

    return ResponseEntity.ok(existingUser); // ✅ FIXED
}
    @GetMapping("/all")
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/me/status")
public ResponseEntity<?> getDonorStatus(
        @RequestHeader("User-Id") Long userId
) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return ResponseEntity.ok(user.getDonorStatus());
}

}
