package com.petfull.backend.service;

import com.petfull.backend.model.Donation;
import com.petfull.backend.model.User;
import com.petfull.backend.repository.DonationRepository;
import com.petfull.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationService(DonationRepository donationRepository, UserRepository userRepository) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    // ── Create ────────────────────────────────────────────────────────────────

    public Donation createDonation(Donation donation, Long userId) {
        User donor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        donation.setDonor(donor);
        donation.setStatus("AVAILABLE");

        Donation saved = donationRepository.save(donation);
        donationRepository.flush();

        return donationRepository.findById(saved.getId())
                .orElseThrow(() -> new RuntimeException("Failed to reload donation after save"));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Donation> getDonationsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return donationRepository.findByDonor_Id(userId);
    }

    public List<Donation> getAvailableDonations() {
        // Mark expired donations first
        List<Donation> available = donationRepository.findByStatus("AVAILABLE");

        List<Donation> expired = available.stream()
                .filter(d -> d.getExpiryDateTime() != null &&
                             d.getExpiryDateTime().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        if (!expired.isEmpty()) {
            expired.forEach(d -> d.setStatus("EXPIRED"));
            donationRepository.saveAll(expired);
        }

        return donationRepository.findByStatus("AVAILABLE");
    }

    public List<Donation> getClaimedDonations(Long userId) {
        return donationRepository.findByClaimedBy_Id(userId);
    }

    // ── Claim ─────────────────────────────────────────────────────────────────

    public Donation claimDonation(Long donationId, Long userId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));

        // Case-insensitive status check so "available" or "AVAILABLE" both work
        if (!"AVAILABLE".equalsIgnoreCase(donation.getStatus())) {
            throw new RuntimeException(
                "Donation is not available for claiming. Current status: " + donation.getStatus()
            );
        }

        // Prevent a donor from claiming their own donation
        if (donation.getDonor().getId().equals(userId)) {
            throw new RuntimeException("You cannot claim your own donation");
        }

        User claimer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        donation.setStatus("CLAIMED");
        donation.setClaimedBy(claimer);

        return donationRepository.save(donation);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    public void deleteDonation(Long donationId, Long userId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));

        if (!donation.getDonor().getId().equals(userId)) {
            throw new SecurityException(
                "User " + userId + " is not authorized to delete donation " + donationId
            );
        }

        donationRepository.delete(donation);
    }
}