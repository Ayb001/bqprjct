package com.regioninvest.config;

import com.regioninvest.entity.*;
import com.regioninvest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Initializing essential platform data...");

        initializeRoles();
        initializeAdminUser();
        initializeSectors();
        initializeTestUsers();

        System.out.println("✅ Initialization completed!");
        System.out.println("📰 Investment articles are available via ArticleService!");
        System.out.println("👨‍💼 Admin login: admin / admin123");
        System.out.println("👨‍💼 Porteur login: porteur1 / password123");
        System.out.println("👤 User login: user1 / password123");
        System.out.println("📊 Projects will be created by users through the interface");
    }

    /**
     * Initialize roles: ADMIN, PORTEUR, USER
     */
    private void initializeRoles() {
        List<String> roleNames = Arrays.asList("ADMIN", "PORTEUR", "USER");

        for (String roleName : roleNames) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role(roleName);
                roleRepository.save(role);
                System.out.println("➕ Role created: " + roleName);
            }
        }
    }

    /**
     * Initialize default admin user
     */
    private void initializeAdminUser() {
        String adminUsername = "admin";

        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            Optional<Role> adminRoleOpt = roleRepository.findByName("ADMIN");

            if (adminRoleOpt.isPresent()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail("admin@regioninvest.ma");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(adminRoleOpt.get());
                admin.setIsEnabled(true);

                userRepository.save(admin);

                System.out.println("👨‍💼 Default admin user created: " + adminUsername);
                System.out.println("   Email: admin@regioninvest.ma");
                System.out.println("   Password: admin123");
                System.out.println("   🚨 CHANGE PASSWORD IMMEDIATELY IN PRODUCTION!");
            }
        } else {
            System.out.println("👨‍💼 Admin user already exists");
        }
    }

    /**
     * Initialize sectors for project categorization
     */
    private void initializeSectors() {
        if (sectorRepository.count() == 0) {
            List<String> sectors = Arrays.asList(
                    "Énergie renouvelable – Énergie solaire",
                    "Énergie renouvelable – Énergie éolienne",
                    "Agriculture",
                    "Tourisme",
                    "Technologie",
                    "Santé",
                    "Éducation",
                    "Artisanat",
                    "Industrie",
                    "Patrimoine",
                    "Finance et Investissement",
                    "Transport et Logistique",
                    "Commerce et Services",
                    "Immobilier",
                    "Environnement"
            );

            for (String sectorName : sectors) {
                Sector sector = new Sector();
                sector.setName(sectorName);
                sector.setIsActive(true);
                sectorRepository.save(sector);
            }

            System.out.println("✅ " + sectors.size() + " sectors created");
        }
    }

    /**
     * Initialize test users for development/demo
     */
    private void initializeTestUsers() {
        // Create porteurs (can create projects)
        createUserIfNotExists("porteur1", "porteur1@example.com", "PORTEUR");
        createUserIfNotExists("porteur2", "porteur2@example.com", "PORTEUR");

        // Create regular users
        createUserIfNotExists("user1", "user1@example.com", "USER");
        createUserIfNotExists("user2", "user2@example.com", "USER");

        System.out.println("✅ Test users verified/created");
    }

    /**
     * Create user if not exists
     */
    private void createUserIfNotExists(String username, String email, String roleName) {
        if (userRepository.findByUsername(username).isEmpty()) {
            try {
                Optional<Role> roleOpt = roleRepository.findByName(roleName);
                if (roleOpt.isPresent()) {
                    User user = new User();
                    user.setUsername(username);
                    user.setEmail(email);
                    user.setPasswordHash(passwordEncoder.encode("password123"));
                    user.setRole(roleOpt.get());
                    user.setIsEnabled(true);

                    userRepository.save(user);

                    System.out.println("➕ User created: " + username + " (" + roleName + ")");
                }
            } catch (Exception e) {
                System.out.println("⚠️ Error creating user " + username + ": " + e.getMessage());
            }
        }
    }
}