package com.regioninvest.config;

import com.regioninvest.entity.Role;
import com.regioninvest.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create default roles if they don't exist
        if (!roleRepository.existsByName("USER")) {
            roleRepository.save(new Role("USER"));
            System.out.println("✅ Created USER role");
        }

        if (!roleRepository.existsByName("ADMIN")) {
            roleRepository.save(new Role("ADMIN"));
            System.out.println("✅ Created ADMIN role");
        }

        System.out.println("🚀 Data initialization completed!");
    }
}