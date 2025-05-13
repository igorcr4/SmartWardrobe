package com.example.smartwardrobe.repository;

import com.example.smartwardrobe.model.PlannerEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlannerRepository extends JpaRepository<PlannerEvent, Long> {
    List<PlannerEvent> findByUserIdOrderByDateAsc(Long userId);

    Optional<PlannerEvent> findByIdAndUserId(Long id, Long userId);
}
