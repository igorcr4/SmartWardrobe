package com.example.smartwardrobe.service;

import com.example.smartwardrobe.model.Outfit;
import com.example.smartwardrobe.model.PlannerEvent;
import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.repository.OutfitRepository;
import com.example.smartwardrobe.repository.PlannerRepository;
import com.example.smartwardrobe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PlannerService {
    @Autowired
    PlannerRepository plannerRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    OutfitRepository outfitRepository;

    public PlannerEvent createEvent(LocalDate date, String title, String description, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User negasit!"));

        PlannerEvent event = new PlannerEvent();
        event.setDate(date);
        event.setTitle(title);
        event.setDescription(description);
        event.setUser(user);

        return plannerRepository.save(event);
    }

    @Transactional
    public PlannerEvent assignOutfit(Long eventId, Long outfitId, Long userId) {
        PlannerEvent event = plannerRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new RuntimeException("Event negasit!"));
        Outfit outfit = outfitRepository.findById(outfitId)
                .orElseThrow(() -> new RuntimeException("Outfit negasit!"));

        event.setOutfit(outfit);
        return plannerRepository.save(event);
    }

    public List<PlannerEvent> getAllEvents(Long userId) {
       return plannerRepository.findByUserIdOrderByDateAsc(userId);
    }

    @Transactional
    public void deleteEvent(Long eventId, Long userId) {
        PlannerEvent event = plannerRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new RuntimeException("Eveniment inexistent!"));

        plannerRepository.delete(event);
    }
}
