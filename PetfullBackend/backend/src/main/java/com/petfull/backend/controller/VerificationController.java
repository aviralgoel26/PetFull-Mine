package com.petfull.backend.controller;

import com.petfull.backend.model.User;
import com.petfull.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin
public class VerificationController {

    private final UserRepository userRepository;

    public VerificationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForVerification(@RequestHeader("User-Id") Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if ("VERIFIED".equalsIgnoreCase(user.getDonorStatus())) {
            return ResponseEntity.badRequest().body("Already verified");
        }

        // ✅ Prevent duplicate pending requests
        if ("PENDING".equalsIgnoreCase(user.getDonorStatus())) {
            return ResponseEntity.badRequest().body("Verification already under review");
        }

        user.setDonorStatus("PENDING");
        userRepository.save(user);

        return ResponseEntity.ok("Verification request submitted");
    }
}