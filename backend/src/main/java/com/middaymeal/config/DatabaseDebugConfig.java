package com.middaymeal.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import jakarta.annotation.PostConstruct;

@Configuration
public class DatabaseDebugConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseDebugConfig.class);
    
    private final Environment environment;
    
    @Value("${spring.datasource.url:NOT_SET}")
    private String datasourceUrl;
    
    @Value("${DATABASE_URL:NOT_SET}")
    private String databaseUrl;
    
    @Value("${DATABASE_PUBLIC_URL:NOT_SET}")
    private String databasePublicUrl;
    
    @Value("${SPRING_PROFILES_ACTIVE:NOT_SET}")
    private String activeProfiles;
    
    public DatabaseDebugConfig(Environment environment) {
        this.environment = environment;
    }
    
    @PostConstruct
    public void logDatabaseConfig() {
        logger.info("=== DATABASE CONFIGURATION DEBUG ===");
        logger.info("Active Profiles: {}", activeProfiles);
        logger.info("spring.datasource.url: {}", datasourceUrl);
        logger.info("DATABASE_URL env var: {}", databaseUrl);
        logger.info("DATABASE_PUBLIC_URL env var: {}", databasePublicUrl);
        logger.info("POSTGRES_USER: {}", environment.getProperty("POSTGRES_USER", "NOT_SET"));
        logger.info("POSTGRES_PASSWORD: {}", environment.getProperty("POSTGRES_PASSWORD", "NOT_SET") != null ? "SET" : "NOT_SET");
        logger.info("=====================================");
    }
}