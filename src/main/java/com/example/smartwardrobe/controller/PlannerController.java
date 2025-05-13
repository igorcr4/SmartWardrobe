package com.example.smartwardrobe.controller;

import com.example.smartwardrobe.DTO.CreatePlannerEventDto;
import com.example.smartwardrobe.DTO.PlannerEventDto;
import com.example.smartwardrobe.model.PlannerEvent;
import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.service.PlannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class PlannerController {
    @Autowired
    PlannerService plannerService;

    @PostMapping
    public ResponseEntity<PlannerEvent> create(@RequestBody CreatePlannerEventDto dto, @AuthenticationPrincipal User user) {
        var event = plannerService.createEvent(dto.date(), dto.title(), dto.description(), user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @GetMapping
    public ResponseEntity<List<PlannerEventDto>> listEvents(@AuthenticationPrincipal User user) {
        List<PlannerEventDto> events =  plannerService.getAllEvents(user.getId())
                .stream()
                .map(PlannerEventDto::from)
                .toList();
        return ResponseEntity.ok(events);
    }

    @DeleteMapping("/{eventId}")
    public void deleteEvent(@PathVariable Long eventId, @AuthenticationPrincipal User user) {
        plannerService.deleteEvent(eventId, user.getId());
    }

    @PatchMapping("/{eventId}/outfit/{outfitId}")
    public ResponseEntity<PlannerEventDto> assignOutfit(@PathVariable Long eventId, @PathVariable Long outfitId, @AuthenticationPrincipal User user) {
        var updated = plannerService.assignOutfit(eventId, outfitId, user.getId());
        return ResponseEntity.ok().body(PlannerEventDto.from(updated));
    }
}
