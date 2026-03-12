package com.petfull.backend.repository;

import com.petfull.backend.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    // Fetch all donations created by a specific donor (user)
    List<Donation> findByDonor_Id(Long donorId);

    // Optional (future use): filter by status
    List<Donation> findByStatus(String status);
}
