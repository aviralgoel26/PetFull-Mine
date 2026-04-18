package com.petfull.backend.service;
import com.petfull.backend.repository.UserRepository;
import com.petfull.backend.model.User;

import com.petfull.backend.model.Donation;
import com.petfull.backend.repository.DonationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// DonationService.java - clean version

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationService(DonationRepository donationRepository, UserRepository userRepository) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    public Donation createDonation(Donation donation, Long userId) {
        User donor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        donation.setDonor(donor);
        donation.setStatus("AVAILABLE");

        Donation saved = donationRepository.save(donation);

        // Force flush and reload so donor_id is confirmed in DB
        donationRepository.flush();
        return donationRepository.findById(saved.getId())
                .orElseThrow(() -> new RuntimeException("Failed to reload donation after save"));
    }

    public List<Donation> getDonationsByUser(Long userId) {
        // Verify user exists first
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return donationRepository.findByDonor_Id(userId);
    }

    public void deleteDonation(Long donationId, Long userId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));

        if (!donation.getDonor().getId().equals(userId)) {
            throw new SecurityException("User " + userId + " is not authorized to delete donation " + donationId);
        }

        donationRepository.delete(donation);
    }

    public List<Donation> getAvailableDonations() {
        List<Donation> donations = donationRepository.findByStatus("AVAILABLE");
        
        List<Donation> expired = donations.stream()
                .filter(d -> d.getExpiryDateTime() != null &&
                             d.getExpiryDateTime().isBefore(java.time.LocalDateTime.now()))
                .collect(java.util.stream.Collectors.toList());

        if (!expired.isEmpty()) {
            expired.forEach(d -> d.setStatus("EXPIRED"));
            donationRepository.saveAll(expired);
        }

        return donationRepository.findByStatus("AVAILABLE");
    }

    public Donation claimDonation(Long donationId, Long userId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));

        if (!donation.getStatus().equals("AVAILABLE")) {
            throw new RuntimeException("Donation is not available for claiming");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        donation.setStatus("CLAIMED");
        donation.setClaimedBy(user);

        return donationRepository.save(donation);
    }

    public List<Donation> getClaimedDonations(Long userId) {
        return donationRepository.findByClaimedBy_Id(userId);
    }
}