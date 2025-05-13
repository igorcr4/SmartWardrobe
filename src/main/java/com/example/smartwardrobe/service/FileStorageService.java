package com.example.smartwardrobe.service;

import com.example.smartwardrobe.config.FileStorageConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) throws IOException {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }
        System.out.println("Upload directory: " + root.toString());
    }

    public String store(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" +
                StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        Path target = this.root.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    public boolean deleteFile(String filename) throws IOException {
        if (filename == null || filename.isBlank()) {
            return false;
        }
        Path filePath = root.resolve(filename).normalize();
        return Files.deleteIfExists(filePath);
    }
}