package com.example.smartwardrobe.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "file")
public record FileStorageConfig(String uploadDir){
}
