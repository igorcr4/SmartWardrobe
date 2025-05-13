package com.example.smartwardrobe.repository;

import com.example.smartwardrobe.model.Outfit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutfitRepository extends JpaRepository<Outfit, Long> {
    List<Outfit> findByUserId(Long userId);
    Optional<Outfit> findByIdAndUserId(Long id, Long userId);

    @Modifying
    @Transactional
    @Query(
            value = "DELETE FROM outfits_garments WHERE outfit_id = :outfitId",
            nativeQuery = true
    )
    void deleteAllGarmentsLinks(@Param("outfitId") Long outfitId);

    @Modifying
    @Transactional
    @Query(
            value = "DELETE FROM outfits WHERE id = :outfitId",
            nativeQuery = true
    )
    void deleteOutfitRow(@Param("outfitId") Long outfitId);
}
