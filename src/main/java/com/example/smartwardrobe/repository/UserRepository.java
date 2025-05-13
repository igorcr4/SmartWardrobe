package com.example.smartwardrobe.repository;

import com.example.smartwardrobe.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String email);

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
