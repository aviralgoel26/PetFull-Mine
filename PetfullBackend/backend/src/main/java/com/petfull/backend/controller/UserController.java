package com.petfull.backend.controller;

import com.petfull.backend.model.User;
import com.petfull.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── Register ──────────────────────────────────────────────────────────────
    // NOTE: Prefer using /api/auth/register (AuthController) going forward.
    // This endpoint is kept for backward compatibility.

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(409).body("Email already registered");
        }

        if (user.getPassword() == null || user.getPassword().length() < 6) {
            return ResponseEntity.status(400).body("Password must be at least 6 characters");
        }

        if (user.getFullName() == null || user.getFullName().trim().length() < 3) {
            return ResponseEntity.status(400).body("Full name must be at least 3 characters");
        }

        // Set defaults if missing
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("RECIPIENT");
        }
        if ("DONOR".equalsIgnoreCase(user.getRole()) && user.getDonorStatus() == null) {
            user.setDonorStatus("UNVERIFIED");
        }

        userRepository.save(user);
        return ResponseEntity.ok("Registration successful");
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    // NOTE: Prefer using /api/auth/login (AuthController) going forward.
    // This endpoint is kept for backward compatibility.

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {

        User existing = userRepository.findByEmail(loginData.getEmail());

        if (existing == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (!existing.getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.status(401).body("Incorrect password");
        }

        // Return full user object so frontend saves correct data to localStorage
        return ResponseEntity.ok(existing);
    }

    // ── Donor status ──────────────────────────────────────────────────────────

    @GetMapping("/me/status")
    public ResponseEntity<?> getDonorStatus(@RequestHeader("User-Id") Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return ResponseEntity.ok(user.getDonorStatus());
    }

    // ── Admin / debug ─────────────────────────────────────────────────────────

    @GetMapping("/all")
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
}