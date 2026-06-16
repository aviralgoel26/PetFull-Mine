package com.petfull.backend.repository;

import com.petfull.backend.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, Long> {

    // Fetch all donations created by a specific donor (user)
    @Query("{ 'donorId': ?0 }")
    List<Donation> findByDonorId(Long donorId);

    // Optional (future use): filter by status
    @Query("{ 'status': ?0 }")
    List<Donation> findByStatus(String status);
    
    // find donations claimed by a specific recipient
    @Query("{ 'claimedById': ?0 }")
    List<Donation> findByClaimedById(Long userId);
}
