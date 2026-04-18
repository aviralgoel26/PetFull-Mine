package com.petfull.backend.controller;

import com.petfull.backend.model.User;
import com.petfull.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        // Return full user object so frontend can save it to localStorage correctly
        return ResponseEntity.ok(user);
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