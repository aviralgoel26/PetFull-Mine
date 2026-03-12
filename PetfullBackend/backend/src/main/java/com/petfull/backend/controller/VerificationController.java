package com.petfull.backend.controller;

import com.petfull.backend.model.User;
import com.petfull.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "http://localhost:3000")
public class VerificationController {

    private final UserRepository userRepository;

    public VerificationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ------------------------------------
    // Apply for Donor Verification
    // ------------------------------------
    @PostMapping("/apply")
    public ResponseEntity<?> applyForVerification(
            @RequestHeader("User-Id") Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only donors can apply
        if (!"DONOR".equals(user.getRole())) {
            return ResponseEntity.badRequest()
                    .body("Only donors can apply for verification");
        }

        // Prevent duplicate requests
        if ("PENDING".equals(user.getDonorStatus())) {
            return ResponseEntity.badRequest()
                    .body("Verification already pending");
        }

        if ("VERIFIED".equals(user.getDonorStatus())) {
            return ResponseEntity.badRequest()
                    .body("You are already a verified donor");
        }

        user.setDonorStatus("PENDING");
        userRepository.save(user);

        return ResponseEntity.ok("Verification request submitted successfully");
    }
}
