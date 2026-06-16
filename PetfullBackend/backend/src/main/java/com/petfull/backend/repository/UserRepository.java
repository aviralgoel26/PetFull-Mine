package com.petfull.backend.repository;

import com.petfull.backend.model.User; // Import the User entity class
import org.springframework.data.mongodb.repository.MongoRepository; // Import MongoRepository for CRUD operations
import org.springframework.data.mongodb.repository.Query; // Import Query annotation for explicit MongoDB queries
import org.springframework.stereotype.Repository; // Import Repository annotation to indicate that this interface is a Spring Data repository

@Repository // Marks this interface as a Spring Data repository
public interface UserRepository extends MongoRepository<User, Long> {
    // Use explicit @Query to match MongoDB field exactly
    @Query("{ 'email' : ?0 }")
    User findByEmail(String email);
}
//findAll();
//deleteById(id);
// without writing any SQL queries. The findByEmail method is a custom query method that 
// Spring Data JPA will automatically implement based on the method name, allowing you 
// to find a user by their email address.