package com.petfull.backend.controller;

import com.petfull.backend.model.Donation;
import com.petfull.backend.service.DonationService;
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

    @GetMapping("/my")
    public List<Donation> getMyDonations(
            @RequestHeader("User-Id") Long userId
    ) {
        return donationService.getDonationsByUser(userId);
    }
    @DeleteMapping("/{id}")
public void deleteDonation(@PathVariable Long id) {
    donationService.deleteDonation(id);
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

}
