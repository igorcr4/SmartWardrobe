package com.example.smartwardrobe.service;

import com.example.smartwardrobe.enums.Gender;
import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.repository.UserRepository;
import com.example.smartwardrobe.validation.UserValidation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserValidation userValidation;

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(String email, String username, String password, Gender gender) {
        userValidation.validateEmail(email);
        userValidation.validateUsername(username);

        String encodedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setGender(gender);

        return userRepository.save(user);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Utilizator negasit"));
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                                  .orElseThrow(() -> new RuntimeException("Email incorect sau nu exista"));
        if(passwordEncoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new RuntimeException("Parola incorecta");
        }
    }
}
