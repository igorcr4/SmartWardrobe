package com.example.smartwardrobe.repository;

import com.example.smartwardrobe.model.Garment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GarmentRepository extends JpaRepository<Garment, Long> {
    List<Garment> findByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM Garment g WHERE g.id = :id")
    void deleteByIdCustom(@Param("id") Long id);
}
