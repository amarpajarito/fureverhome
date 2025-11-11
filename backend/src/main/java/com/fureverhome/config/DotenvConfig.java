package com.fureverhome.config;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvConfig {

    static {
        try {
            // Load .env file before Spring Boot starts
            Dotenv dotenv = Dotenv.configure()
                    .directory("../")
                    .ignoreIfMissing()
                    .load();

            // Set system properties from .env file
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });

            System.out.println("Environment variables loaded from .env file");
        } catch (Exception e) {
            System.err.println("Warning: Could not load .env file - " + e.getMessage());
            System.err.println("Application may fail to start without required environment variables");
        }
    }
}

