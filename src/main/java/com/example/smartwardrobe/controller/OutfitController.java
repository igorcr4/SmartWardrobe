package com.example.smartwardrobe.controller;

import com.example.smartwardrobe.DTO.OutfitDto;
import com.example.smartwardrobe.model.Outfit;
import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.service.OutfitService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/outfit")
@RequiredArgsConstructor
public class OutfitController {
    @Autowired
    OutfitService outfitService;

    @PostMapping
    public OutfitDto addOutfit(@RequestParam List<Long> garmentId,
                               @RequestParam String name,
                               @RequestParam String email) {
        Outfit saved = outfitService.saveOutfit(garmentId, name, email);
        return OutfitDto.from(saved);
    }

    @GetMapping
    public List<OutfitDto> listOutfits(@AuthenticationPrincipal User user) {
        return outfitService
                .getOutfitsByUserId(user.getId())
                .stream()
                .map(OutfitDto::from)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{outfitId}")
    public ResponseEntity<?> deleteOutfit(@PathVariable Long outfitId,
                                          @AuthenticationPrincipal User user) {
        outfitService.deleteOutfit(outfitId, user.getId());
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{outfitId}/garments/{garmentId}")
    public OutfitDto deleteGarment(@PathVariable Long garmentId, @PathVariable Long outfitId, @AuthenticationPrincipal User user) {
        Outfit updated = outfitService.removeGarment(garmentId, outfitId, user.getId());
        return OutfitDto.from(updated);
    }
}

