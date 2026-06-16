package com.petfull.backend.repository;

import com.petfull.backend.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, Long> {

    // Fetch all donations created by a specific donor (user)
    List<Donation> findByDonor_Id(Long donorId);

    // Optional (future use): filter by status
    List<Donation> findByStatus(String status);
    //  find donations claimed by a specific recipient
    List<Donation> findByClaimedBy_Id(Long userId);
}
