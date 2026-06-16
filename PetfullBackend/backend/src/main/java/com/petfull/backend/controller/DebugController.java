package com.petfull.backend.controller;

import com.petfull.backend.model.User;
import com.petfull.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin
public class DebugController {

    private final UserRepository userRepository;

    public DebugController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            
            // Debug output
            System.out.println("🔍 DEBUG: Total users in database: " + users.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalCount", users.size());
            response.put("users", users);
            
            // Print each user's details for debugging
            for (int i = 0; i < users.size(); i++) {
                User u = users.get(i);
                System.out.println("User " + i + ": ID=" + u.getId() + ", Email=" + u.getEmail() + ", Name=" + u.getFullName());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error in getAllUsers: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/user-by-email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            System.out.println("🔍 DEBUG: Searching for email: " + email);
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                System.out.println("❌ User not found for email: " + email);
                return ResponseEntity.status(404).body("User not found: " + email);
            }
            
            System.out.println("✅ User found: " + user.getFullName());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.out.println("❌ Error in getUserByEmail: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/test-login")
    public ResponseEntity<?> testLogin(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            System.out.println("🔍 DEBUG TEST LOGIN:");
            System.out.println("  Email: " + email);
            System.out.println("  Password: " + (password != null ? "PROVIDED" : "NULL"));
            
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                System.out.println("  Result: User not found");
                return ResponseEntity.status(404).body("User not found");
            }
            
            System.out.println("  Result: User found - " + user.getFullName());
            System.out.println("  Stored password: " + user.getPassword());
            System.out.println("  Provided password: " + password);
            System.out.println("  Match: " + (user.getPassword().equals(password) ? "YES" : "NO"));
            
            if (!user.getPassword().equals(password)) {
                return ResponseEntity.status(401).body("Invalid password");
            }
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.out.println("❌ Error in testLogin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
