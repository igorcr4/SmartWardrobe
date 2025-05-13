package com.example.smartwardrobe.DTO;

import com.example.smartwardrobe.model.PlannerEvent;

import java.time.LocalDate;

public record PlannerEventDto(
        Long id,
        LocalDate date,
        String title,
        String description,
        Long outfitId
) {
    public static PlannerEventDto from(PlannerEvent ev) {
        return new PlannerEventDto(
                ev.getId(),
                ev.getDate(),
                ev.getTitle(),
                ev.getDescription(),
                ev.getOutfit() != null ? ev.getOutfit().getId() : null
        );
    }
}
