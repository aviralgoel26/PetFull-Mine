package com.petfull.backend.controller;

import com.petfull.backend.model.Donation;
import com.petfull.backend.service.DonationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:3000")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    // ── Donor endpoints ───────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> createDonation(
            @RequestBody Donation donation,
            @RequestHeader("User-Id") Long userId) {
        try {
            return ResponseEntity.ok(donationService.createDonation(donation, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyDonations(
            @RequestHeader("User-Id") Long userId) {
        try {
            return ResponseEntity.ok(donationService.getDonationsByUser(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDonation(
            @PathVariable Long id,
            @RequestHeader("User-Id") Long userId) {
        try {
            donationService.deleteDonation(id, userId);
            return ResponseEntity.ok("Donation deleted");
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // ── Recipient endpoints ───────────────────────────────────────────────────

    @GetMapping("/available")
    public ResponseEntity<List<Donation>> getAvailableDonations() {
        return ResponseEntity.ok(donationService.getAvailableDonations());
    }

    @PutMapping("/claim/{id}")
    public ResponseEntity<?> claimDonation(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            return ResponseEntity.ok(donationService.claimDonation(id, userId));
        } catch (RuntimeException e) {
            // Returns the exact error message to the frontend toast
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/claimed")
    public ResponseEntity<List<Donation>> getClaimedDonations(
            @RequestParam Long userId) {
        return ResponseEntity.ok(donationService.getClaimedDonations(userId));
    }
}