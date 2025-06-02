package com.regioninvest.config;

import com.regioninvest.service.UserService;
import com.regioninvest.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    public JwtRequestFilter jwtRequestFilter() {
        return new JwtRequestFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                                // 🔓 TEMPORARY: Allow ALL requests for debugging
                                .requestMatchers("/**").permitAll()

                        // Once working, replace above with these specific rules:
                        /*
                        // 🔓 Public endpoints - No authentication required
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // 🔓 SPECIFIC public project endpoints
                        .requestMatchers("/api/projects/public-create").permitAll()
                        .requestMatchers("/api/projects/debug-create").permitAll()
                        .requestMatchers("POST", "/api/projects").permitAll()

                        // 🔓 Project READ operations - Anyone can view projects
                        .requestMatchers("GET", "/api/projects/**").permitAll()

                        // 🔒 SPECIFIC project endpoints that need auth
                        .requestMatchers("POST", "/api/projects/upload").authenticated()
                        .requestMatchers("PUT", "/api/projects/**").authenticated()
                        .requestMatchers("DELETE", "/api/projects/**").authenticated()
                        .requestMatchers("GET", "/api/projects/my").authenticated()

                        // 🔒 All other requests need authentication
                        .anyRequest().authenticated()
                        */
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.frameOptions().sameOrigin()); // For H2 Console

        // TEMPORARILY disable JWT filter for debugging
        // http.addFilterBefore(jwtRequestFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 🌐 Allow React development servers
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:3001"
        ));

        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"
        ));

        // Allow all headers (including Authorization)
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // 🔑 IMPORTANT: Enable credentials for JWT tokens
        configuration.setAllowCredentials(true);

        // Cache preflight for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Component
    public static class JwtAuthenticationEntryPoint implements org.springframework.security.web.AuthenticationEntryPoint {
        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response,
                             org.springframework.security.core.AuthenticationException authException) throws IOException {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getOutputStream().println(
                    "{ \"error\": \"Unauthorized\", \"message\": \"Authentication required\", \"status\": 401 }"
            );
        }
    }

    @Component
    public static class JwtRequestFilter extends OncePerRequestFilter {

        @Autowired
        private UserService userService;

        @Autowired
        private JwtUtil jwtUtil;

        @Override
        protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
            // TEMPORARILY: Skip ALL requests for debugging
            return true;

            // Once working, replace above with proper filtering logic:
            /*
            String path = request.getRequestURI();
            String method = request.getMethod();

            // 🔓 Skip JWT processing for public endpoints
            List<String> publicPaths = Arrays.asList(
                    "/api/auth/",
                    "/api/public/",
                    "/api/test/",
                    "/h2-console/",
                    "/uploads/",
                    "/actuator/"
            );

            if (publicPaths.stream().anyMatch(path::startsWith)) {
                return true;
            }

            // 🔓 Specific public project endpoints
            List<String> publicProjectEndpoints = Arrays.asList(
                    "/api/projects/public-create",
                    "/api/projects/debug-create"
            );

            if (publicProjectEndpoints.stream().anyMatch(path::equals)) {
                return true;
            }

            // 🔓 Skip JWT for GET requests to projects (anyone can view)
            if ("GET".equals(method) && path.startsWith("/api/projects")) {
                return true;
            }

            // 🔓 Skip JWT for main project creation (temporarily)
            if ("POST".equals(method) && path.equals("/api/projects")) {
                return true;
            }

            return false;
            */
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                        FilterChain chain) throws ServletException, IOException {

            final String requestTokenHeader = request.getHeader("Authorization");

            String username = null;
            String jwtToken = null;

            if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
                jwtToken = requestTokenHeader.substring(7);
                try {
                    username = jwtUtil.extractUsername(jwtToken);
                } catch (Exception e) {
                    logger.error("JWT Token extraction failed: " + e.getMessage());
                }
            } else {
                logger.debug("No JWT token found in request header");
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    UserDetails userDetails = userService.loadUserByUsername(username);

                    if (jwtUtil.validateToken(jwtToken, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.debug("JWT authentication successful for user: " + username);
                    } else {
                        logger.warn("JWT token validation failed for user: " + username);
                    }
                } catch (Exception e) {
                    logger.error("JWT authentication failed: " + e.getMessage());
                }
            }

            chain.doFilter(request, response);
        }
    }
}