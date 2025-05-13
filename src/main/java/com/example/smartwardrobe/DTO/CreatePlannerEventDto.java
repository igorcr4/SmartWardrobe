package com.example.smartwardrobe.DTO;

import java.time.LocalDate;

public record CreatePlannerEventDto(
        LocalDate date,
        String title,
        String description
) {}
