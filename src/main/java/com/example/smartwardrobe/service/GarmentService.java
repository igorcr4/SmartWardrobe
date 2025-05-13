package com.example.smartwardrobe.service;

import com.example.smartwardrobe.model.Garment;
import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.repository.GarmentRepository;
import com.example.smartwardrobe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
public class GarmentService {
    @Autowired
    private GarmentRepository garmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Salvează un nou articol în baza de date, setând URL-ul imaginii cu prefixul "/uploads/".
     */
    public Garment saveGarment(String name, String type, String imageUrl, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizator negăsit!"));

        Garment garment = new Garment();
        garment.setName(name);
        garment.setType(type);
        if (imageUrl != null && !imageUrl.isBlank()) {
            garment.setImageUrl("/uploads/" + imageUrl.trim());
        } else {
            garment.setImageUrl("/images/no-image.png");
        }
        garment.setUser(user);
        return garmentRepository.save(garment);
    }

    /**
     * Returnează lista articolelor pentru un utilizator.
     */
    public List<Garment> getGarmentsForUser(Long userId) {
        return garmentRepository.findByUserId(userId);
    }

    /**
     * Șterge articolul și fișierul asociat din disc.
     */
    @Transactional
    public void deleteGarment(Long id) {
        //Găsim haina – aruncăm excepție dacă nu există
        Garment garment = garmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Articol negăsit!"));

    /* Rupem legăturile MANY-TO-MANY
       - Eliminăm haina din fiecare outfit
       - Resetăm colecția locală pentru a evita problemele Hibernate
    */
        garment.getOutfits().forEach(outfit -> outfit.getGarments().remove(garment));
        garment.getOutfits().clear();

    /* 3) Ștergem fișierul de pe disc (dacă este într-adevăr unul încărcat
          de noi, adică începe cu /uploads/)                               */
        String imageUrl = garment.getImageUrl();
        if (imageUrl != null && imageUrl.startsWith("/uploads/")) {
            String filename = imageUrl.substring("/uploads/".length());
            try {
                boolean deleted = fileStorageService.deleteFile(filename);
                System.out.println("Fișier imagine șters: " + deleted);
            } catch (IOException e) {
                throw new RuntimeException("Eroare la ștergerea fișierului imagine", e);
            }
        }

        // 4) În final, ștergem entitatea Garment
        garmentRepository.delete(garment);
    }
}
