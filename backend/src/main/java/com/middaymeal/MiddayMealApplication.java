package com.middaymeal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MiddayMealApplication {
    public static void main(String[] args) {
        SpringApplication.run(MiddayMealApplication.class, args);
    }
}