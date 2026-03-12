package com.petfull.backend.controller;

import com.petfull.backend.model.User;
import com.petfull.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public String loginUser(@RequestBody User loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return "USER_NOT_FOUND";
        }

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return "INVALID_PASSWORD";
        }

        return "LOGIN_SUCCESS";
    }
}
