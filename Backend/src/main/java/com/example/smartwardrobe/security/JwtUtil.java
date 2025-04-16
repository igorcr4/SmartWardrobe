package com.example.smartwardrobe.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private Long expirationMillis;

    public String generateToken(String username) {
        Key key = Ke.hmacShaKeyFor(secret.getBytes());
    }
}
