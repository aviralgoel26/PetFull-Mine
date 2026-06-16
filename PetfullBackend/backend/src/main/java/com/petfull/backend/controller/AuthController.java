package com.petfull.backend.controller;

import com.petfull.backend.model.User;
import com.petfull.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            System.out.println("🔍 Login attempt for email: " + loginRequest.getEmail());
            System.out.println("🔍 Password provided: " + (loginRequest.getPassword() != null ? "YES" : "NO"));
            
            // Debug: Print first 3 users from database
            System.out.println("🔍 Checking database - Total users: " + userRepository.count());
            
            User user = userRepository.findByEmail(loginRequest.getEmail());
            System.out.println("🔍 Query result: " + (user != null ? "User found - " + user.getFullName() : "User not found"));

            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            if (!user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.status(401).body("Invalid password");
            }

            // Return full user object so frontend can save it to localStorage correctly
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.out.println("❌ Exception in loginUser: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Login error: " + e.getMessage());
        }
    }

    // ── Register ──────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {

        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            return ResponseEntity.status(409).body("Email already registered");
        }

        // Default role if not provided
        if (newUser.getRole() == null || newUser.getRole().isBlank()) {
            newUser.setRole("RECIPIENT");
        }

        // Default donor status for donors
        if ("DONOR".equalsIgnoreCase(newUser.getRole())) {
            newUser.setDonorStatus("UNVERIFIED");
        }

        User saved = userRepository.save(newUser);
        return ResponseEntity.ok(saved);
    }
}