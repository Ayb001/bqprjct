package com.regioninvest.controller;

import com.regioninvest.dto.AuthResponse;
import com.regioninvest.dto.LoginRequest;
import com.regioninvest.dto.RegisterRequest;
import com.regioninvest.entity.User;
import com.regioninvest.service.UserService;
import com.regioninvest.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // 🔐 Authenticate using email
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Load user details by email
            final UserDetails userDetails = userService.loadUserByEmail(loginRequest.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);

            // Get user by email
            User user = userService.findByEmail(loginRequest.getEmail()).orElseThrow();

            System.out.println("✅ Successful login: " + user.getUsername() + " (" + user.getRole().getName() + ") at " + java.time.LocalDateTime.now());

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().getName()
            ));

        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.badRequest().body(error);

        } catch (DisabledException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Account is disabled. Please contact administrator.");
            return ResponseEntity.badRequest().body(error);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);

            System.out.println("✅ New user registered: " + user.getUsername() + " at " + java.time.LocalDateTime.now());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account created successfully! Please log in with your credentials.");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().getName());
            response.put("created_at", user.getCreatedAt());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed. Please try again.");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");

            if (jwtUtil.validateToken(jwt)) {
                String username = jwtUtil.extractUsername(jwt);
                User user = userService.findByUsername(username).orElseThrow();

                // Check if user is still enabled
                if (!user.getIsEnabled()) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("valid", false);
                    error.put("error", "Account is disabled");
                    return ResponseEntity.badRequest().body(error);
                }

                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                response.put("role", user.getRole().getName());
                response.put("expires_at", jwtUtil.extractExpiration(jwt));

                return ResponseEntity.ok(response);
            }

            Map<String, Object> error = new HashMap<>();
            error.put("valid", false);
            error.put("error", "Invalid or expired token");
            return ResponseEntity.badRequest().body(error);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("valid", false);
            error.put("error", "Token validation failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(jwt);

            System.out.println("✅ User logged out: " + username + " at " + java.time.LocalDateTime.now());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Logged out successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logout completed");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 🆕 NEW: Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");

            if (!jwtUtil.validateToken(jwt)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid token"));
            }

            String username = jwtUtil.extractUsername(jwt);
            User user = userService.findByUsername(username).orElseThrow();

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole().getName());
            userInfo.put("enabled", user.getIsEnabled());
            userInfo.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(userInfo);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to get user info"));
        }
    }
}