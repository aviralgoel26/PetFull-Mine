///UserRepository is a Spring Data JPA interface that provides database operations for the User entity.
///It eliminates the need to write SQL by automatically generating queries at runtime.
///It also defines a custom query method (findByEmail) used for authentication and user lookup.


package com.petfull.backend.repository;

import com.petfull.backend.model.User; // Import the User entity class
import org.springframework.data.mongodb.repository.MongoRepository; // Import MongoRepository for CRUD operations
import org.springframework.data.mongodb.repository.Query; // Import Query annotation for explicit MongoDB queries
import org.springframework.stereotype.Repository; // Import Repository annotation to indicate that this interface is a Spring Data repository

@Repository // Marks this interface as a Spring Data repository
public interface UserRepository extends MongoRepository<User, Long> {
    @Query("{ 'email' : ?0 }")
    User findByEmail(String email);
}
//give me :-
// save(user);
//findById(id);
//findAll();
//deleteById(id);
// without writing any SQL queries. The findByEmail method is a custom query method that 
// Spring Data JPA will automatically implement based on the method name, allowing you 
// to find a user by their email address.