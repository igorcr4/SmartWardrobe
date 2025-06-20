package com.example.smartwardrobe.validation;


import com.example.smartwardrobe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserValidation {
    @Autowired
    UserRepository userRepository;

    String emailRegex = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
            + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

    public void validateEmail(String email) {
        if(email == null || userRepository.existsByEmail(email) || !email.matches(emailRegex)) {
            throw new RuntimeException("Email: " + email + " este invalid sau deja exista!");
        }
    }

    public void validateUsername(String username) {
        if(username == null || userRepository.existsByUsername(username)) {
            throw new RuntimeException("Email: " + username + " este invalid sau deja exista!");
        }
    }
}
