package com.example.smartwardrobe;

import com.example.smartwardrobe.config.FileStorageConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties(FileStorageConfig.class)
@EnableScheduling
public class MedaSmartWardrobeApplication {
	public static void main(String[] args) {
		SpringApplication.run(MedaSmartWardrobeApplication.class, args);
	}
}
