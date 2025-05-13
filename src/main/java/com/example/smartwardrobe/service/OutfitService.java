package com.example.smartwardrobe.service;

import com.example.smartwardrobe.model.Garment;
import com.example.smartwardrobe.model.Outfit;
import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.repository.GarmentRepository;
import com.example.smartwardrobe.repository.OutfitRepository;
import com.example.smartwardrobe.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

@Service
public class OutfitService {
    @Autowired
    OutfitRepository outfitRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    GarmentRepository garmentRepository;

    public Outfit saveOutfit(List<Long> garmentId, String outfitName, String email) {
        Set<Garment> garments = new HashSet<>(garmentRepository.findAllById(garmentId));
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Utilizator negasit"));

        Outfit outfit = new Outfit();
        outfit.setName(outfitName);
        outfit.setTimestamp(Instant.now());
        outfit.setGarments(garments);
        outfit.setUser(user);
        return outfitRepository.save(outfit);
    }

    public List<Outfit> getOutfitsByUserId(Long userId) {
        return outfitRepository.findByUserId(userId);
    }


    @Transactional
    public void deleteOutfit(Long outfitId, Long userId) {
        // 1) verificăm existența și drepturile
        outfitRepository.findByIdAndUserId(outfitId, userId).orElseThrow(() -> new EntityNotFoundException("Outfit inexistent"));

        // 2) ștergem întâi legăturile din join-table
        outfitRepository.deleteAllGarmentsLinks(outfitId);

        // 3) apoi ștergem rândul outfit propriu-zis
        outfitRepository.deleteOutfitRow(outfitId);
    }

    @Transactional
    public Outfit removeGarment(Long garmentId, Long outfitId, Long userId) {
        Outfit o = outfitRepository.findByIdAndUserId(outfitId, userId)
                .orElseThrow(() -> new RuntimeException("Outfit inexistent!"));
        o.getGarments().removeIf(g -> g.getId().equals(garmentId));
        return outfitRepository.save(o);
    }
}
