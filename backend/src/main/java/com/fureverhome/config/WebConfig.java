package com.fureverhome.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration
 * Note: CORS is handled globally in SecurityConfig
 * Note: Avatars are stored in database, no file upload handling needed
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // No additional configuration needed - CORS handled in SecurityConfig
}

