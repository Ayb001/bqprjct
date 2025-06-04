package com.regioninvest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableScheduling
public class RestTemplateConfig {

    /**
     * RestTemplate bean for making HTTP requests to news APIs
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}