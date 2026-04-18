package com.petfull.backend.controller;

import com.petfull.backend.model.Donation;
import com.petfull.backend.service.DonationService;
import org.springframework.web.bind.annotation.*;
import com.petfull.backend.repository.DonationRepository;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:3000")
public class DonationController {

    private final DonationService donationService;
    private final DonationRepository donationRepository;
    
    public DonationController(DonationService donationService, DonationRepository donationRepository) {
        this.donationService = donationService;
        this.donationRepository = donationRepository;
    }

    @GetMapping("/my")
public List<Donation> getMyDonations(
        @RequestHeader("User-Id") Long userId
) {
    System.out.println("User ID received: " + userId);
    return donationService.getDonationsByUser(userId);
}
    @DeleteMapping("/{id}")
public void deleteDonation(
        @PathVariable Long id,
        @RequestHeader("User-Id") Long userId
) {
    donationService.deleteDonation(id, userId);
}
@GetMapping("/available")
public List<Donation> getAvailableDonations() {
    return donationService.getAvailableDonations();
}
    @PostMapping
public Donation createDonation(
        @RequestBody Donation donation,
        @RequestHeader("User-Id") Long userId
) {
    return donationService.createDonation(donation, userId);
}
@PutMapping("/claim/{id}")
public Donation claimDonation(
        @PathVariable Long id,
        @RequestParam Long userId
) {
    return donationService.claimDonation(id, userId);
}


@GetMapping("/claimed")
public List<Donation> getClaimedDonations(@RequestParam Long userId) {
    return donationService.getClaimedDonations(userId);
}

// Add to DonationController temporarily for debugging
@GetMapping("/debug/{donationId}")
public String debugDonation(@PathVariable Long donationId) {
    return donationRepository.findById(donationId)
        .map(d -> "Donation " + donationId + " belongs to donor_id: " + 
                  (d.getDonor() != null ? d.getDonor().getId() : "NULL"))
        .orElse("Not found");
}

}
