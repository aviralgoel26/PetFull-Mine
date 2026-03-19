package com.petfull.backend.service;
import com.petfull.backend.repository.UserRepository;
import com.petfull.backend.model.User;

import com.petfull.backend.model.Donation;
import com.petfull.backend.repository.DonationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    public DonationService(
        DonationRepository donationRepository,
        UserRepository userRepository
) {
    this.donationRepository = donationRepository;
    this.userRepository = userRepository;
}

    // -------------------------------
    // Create a new donation
    // -------------------------------
    public Donation createDonation(Donation donation, Long userId) {

    User donor = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    donation.setDonor(donor);
    donation.setStatus("AVAILABLE");

    return donationRepository.save(donation);
}
public void deleteDonation(Long id) {
    donationRepository.deleteById(id);
}

    // -------------------------------
    // Get all donations of a donor
    // -------------------------------
    public List<Donation> getDonationsByUser(Long userId) {
    return donationRepository.findByDonor_Id(userId);
}
public List<Donation> getAvailableDonations() {
    return donationRepository.findByStatus("AVAILABLE");
}


    // -------------------------------
    // Delete donation (only own donation)
    // -------------------------------
    public void deleteDonation(Long donationId, Long userId) {

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (!donation.getDonor().getId().equals(userId)) {
    throw new RuntimeException("Unauthorized to delete this donation");
}
        donationRepository.delete(donation);

    }
}
