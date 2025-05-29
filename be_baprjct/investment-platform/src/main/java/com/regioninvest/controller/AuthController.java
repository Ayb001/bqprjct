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
            // 🔐 Enhanced security: Authenticate user credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed");
            return ResponseEntity.badRequest().body(error);
        }

        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userService.findByUsername(loginRequest.getUsername()).orElseThrow();

        // 📊 Log successful login (optional - for security monitoring)
        System.out.println("✅ Successful login: " + user.getUsername() + " at " + java.time.LocalDateTime.now());

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // 🔐 SECURITY ENHANCEMENT: Just create user, don't auto-login
            User user = userService.registerUser(registerRequest);

            // 📊 Log successful registration (optional - for security monitoring)
            System.out.println("✅ New user registered: " + user.getUsername() + " at " + java.time.LocalDateTime.now());

            // 🔐 Return success message WITHOUT JWT token
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account created successfully! Please log in with your credentials.");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
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
            // 🔐 In a production environment, you might want to:
            // 1. Add token to a blacklist
            // 2. Log the logout event
            // 3. Clear any server-side sessions

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
}