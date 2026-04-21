package com.petfull.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000","https://petfull.netlify.app")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
.allowCredentials(true);
            }
        };
    }
}