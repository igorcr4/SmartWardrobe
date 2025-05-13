package com.example.smartwardrobe.controller;

import com.example.smartwardrobe.DTO.AuthResponse;
import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.security.JwtUtil;
import com.example.smartwardrobe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User createUser = userService.registerUser(user.getEmail(), user.getUsername(), user.getPassword(), user.getGender());
        return ResponseEntity.status(HttpStatus.CREATED).body(createUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        String jwtToken = jwtUtil.generateToken(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(new AuthResponse(jwtToken));
    }
}
