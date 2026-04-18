package com.petfull.backend.controller;

import com.petfull.backend.model.Donation;
import com.petfull.backend.model.User;
import com.petfull.backend.repository.DonationRepository;
import com.petfull.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    public AdminController(UserRepository userRepository, DonationRepository donationRepository) {
        this.userRepository = userRepository;
        this.donationRepository = donationRepository;
    }

    // ── Users ──────────────────────────────────────────────────────────────

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ── Donor Verification ─────────────────────────────────────────────────

    @PutMapping("/donor/{id}/verify")
    public ResponseEntity<?> verifyDonor(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setDonorStatus("VERIFIED");
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/donor/{id}/reject")
    public ResponseEntity<?> rejectDonor(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setDonorStatus("REJECTED");
        return ResponseEntity.ok(userRepository.save(user));
    }

    // ── Donations ──────────────────────────────────────────────────────────

    @GetMapping("/donations")
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    @DeleteMapping("/donations/{id}")
    public ResponseEntity<String> deleteDonation(@PathVariable Long id) {
        if (!donationRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Donation not found");
        }
        donationRepository.deleteById(id);
        return ResponseEntity.ok("Donation deleted");
    }

    // ── Stats / Logs ───────────────────────────────────────────────────────

    @GetMapping("/logs")
    public Map<String, Object> getStats() {
        List<User> users = userRepository.findAll();
        List<Donation> donations = donationRepository.findAll();

        long donors = users.stream()
                .filter(u -> "DONOR".equalsIgnoreCase(u.getRole()))
                .count();

        long recipients = users.stream()
                .filter(u -> "RECIPIENT".equalsIgnoreCase(u.getRole()))
                .count();

        long claimed = donations.stream()
                .filter(d -> "CLAIMED".equalsIgnoreCase(d.getStatus()))
                .count();

        long expired = donations.stream()
                .filter(d -> "EXPIRED".equalsIgnoreCase(d.getStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("donors", donors);
        stats.put("recipients", recipients);
        stats.put("totalDonations", donations.size());
        stats.put("claimed", claimed);
        stats.put("expired", expired);

        return stats;
    }
}