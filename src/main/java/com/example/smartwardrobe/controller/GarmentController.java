package com.example.smartwardrobe.controller;

import com.example.smartwardrobe.model.Garment;
import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.service.FileStorageService;
import com.example.smartwardrobe.service.GarmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/garments")
@RequiredArgsConstructor
public class GarmentController {
    @Autowired
    GarmentService garmentService;
    @Autowired
    FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Garment> uploadGarment(
            @RequestPart("name") String name,
            @RequestPart("type") String type,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal User user) throws IOException {

        String filename = null;
        if (file != null && !file.isEmpty()) {
            filename = fileStorageService.store(file);
            System.out.println("File saved: " + filename);
        }

        Garment savedGarment = garmentService.saveGarment(name, type, filename, user.getId());
        return ResponseEntity.ok(savedGarment);
    }

    @GetMapping
    public Iterable<Garment> list(@AuthenticationPrincipal User user) {
        return garmentService.getGarmentsForUser(user.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        garmentService.deleteGarment(id);
        return ResponseEntity.ok().build();
    }
}
