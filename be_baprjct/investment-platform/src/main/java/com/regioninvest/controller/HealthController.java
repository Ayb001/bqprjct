package com.regioninvest.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        return Map.of(
                "status", "UP",
                "timestamp", LocalDateTime.now().toString(),
                "service", "Investment Platform",
                "version", "1.0.0"
        );
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
                "backend", "RUNNING",
                "database", "CONNECTED",
                "api", "AVAILABLE",
                "timestamp", LocalDateTime.now().toString()
        );
    }
}