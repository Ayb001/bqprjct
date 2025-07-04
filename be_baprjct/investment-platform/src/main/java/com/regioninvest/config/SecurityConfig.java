package com.regioninvest.config;

import com.regioninvest.service.UserService;
import com.regioninvest.util.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // ← ADD THIS for @PreAuthorize to work
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

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

    /**
     * ENHANCED CORS Configuration for file uploads and multipart data
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow all origins - you can restrict this in production
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));

        // Allow all HTTP methods including OPTIONS for preflight
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"
        ));

        // Allow all headers including those needed for file uploads
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Allow credentials (important for authentication)
        configuration.setAllowCredentials(true);

        // Expose headers that might be needed by frontend
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "Content-Length", "X-Requested-With"
        ));

        // Set max age for preflight requests (24 hours)
        configuration.setMaxAge(86400L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ← ENHANCED CORS
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authz -> authz
                        // 🔓 Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll() // ← ADD THIS
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll() // ← ADD THIS

                        // 📊 Public project endpoints (read-only) ← ADD THESE
                        .requestMatchers(HttpMethod.GET, "/api/projects", "/api/projects/search", "/api/projects/stats").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/projects/{id}", "/api/projects/{id}/similar", "/api/projects/{id}/view").permitAll()
                        .requestMatchers("/api/articles/**").permitAll()

                        // 🧪 Test endpoints (remove in production)
                        .requestMatchers("/api/projects/test-upload").permitAll()

                        // 👑 Admin endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 🏗️ Porteur endpoints - FIXED: Both create endpoints
                        .requestMatchers(HttpMethod.POST, "/api/projects").hasAnyRole("ADMIN", "PORTEUR")
                        .requestMatchers(HttpMethod.POST, "/api/projects/upload").hasAnyRole("ADMIN", "PORTEUR")
                        .requestMatchers(HttpMethod.PUT, "/api/projects/**").hasAnyRole("ADMIN", "PORTEUR")
                        .requestMatchers(HttpMethod.DELETE, "/api/projects/**").hasAnyRole("ADMIN", "PORTEUR")
                        .requestMatchers("/api/projects/my").hasAnyRole("ADMIN", "PORTEUR")
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

        // 🔑 Add JWT filter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}