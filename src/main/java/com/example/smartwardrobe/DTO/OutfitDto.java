package com.example.smartwardrobe.DTO;

import com.example.smartwardrobe.model.Outfit;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public record OutfitDto(Long id,
                        String name,
                        Instant timestamp,
                        List<GarmentDto> garments) {

    public static OutfitDto from(Outfit o) {
        return new OutfitDto(
                o.getId(),
                o.getName(),
                o.getTimestamp(),
                o.getGarments().stream()
                        .map(GarmentDto::from)
                        .collect(Collectors.toList())
        );
    }

    public record GarmentDto(Long id, String name, String type, String imageUrl) {
        public static GarmentDto from(com.example.smartwardrobe.model.Garment g) {
            return new GarmentDto(g.getId(), g.getName(), g.getType(), g.getImageUrl());
        }
    }
}
