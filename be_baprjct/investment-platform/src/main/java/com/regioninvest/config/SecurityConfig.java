package com.regioninvest.config;

import com.regioninvest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 🆕 CUSTOM: Email-based UserDetailsService
     * This makes Spring Security authenticate using EMAIL instead of USERNAME
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            try {
                return userService.loadUserByEmail(email);
            } catch (Exception e) {
                throw new UsernameNotFoundException("User not found with email: " + email);
            }
        };
    }

    /**
     * 🔐 UPDATED: Authentication Provider for Email-based login
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authz -> authz
                        // 🔓 Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()

                        // 👑 Admin endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 🏗️ Porteur endpoints
                        .requestMatchers("/api/porteur/**").hasAnyRole("ADMIN", "PORTEUR")

                        // 💼 Investment endpoints
                        .requestMatchers("/api/investments/**").hasAnyRole("ADMIN", "PORTEUR", "INVESTISSEUR")

                        // 🔒 All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                // 🗂️ H2 Console Configuration (for development)
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin())
                );

        // 🔧 Set custom authentication provider
        http.authenticationProvider(authenticationProvider());

        return http.build();
    }
}