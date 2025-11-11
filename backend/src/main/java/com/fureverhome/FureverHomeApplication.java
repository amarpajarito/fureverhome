package com.fureverhome;

import com.fureverhome.config.DotenvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FureverHomeApplication {

    // Load environment variables before Spring Boot starts
    static {
        // This triggers the static block in DotenvConfig
        try {
            Class.forName("com.fureverhome.config.DotenvConfig");
        } catch (ClassNotFoundException e) {
            System.err.println("Failed to load DotenvConfig: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(FureverHomeApplication.class, args);
    }
}

