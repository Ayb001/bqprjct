package com.regioninvest.service;

import com.regioninvest.dto.RegisterRequest;
import com.regioninvest.entity.Role;
import com.regioninvest.entity.User;
import com.regioninvest.repository.RoleRepository;
import com.regioninvest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Check if user is enabled
        if (!user.getIsEnabled()) {
            throw new org.springframework.security.authentication.DisabledException("User account is disabled: " + username);
        }

        return user;
    }

    /**
     * 🆕 NEW: Load user by email for authentication
     */
    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Check if user is enabled
        if (!user.getIsEnabled()) {
            throw new org.springframework.security.authentication.DisabledException("User account is disabled: " + email);
        }

        return user;
    }

    /**
     * Register user with default USER role
     */
    public User registerUser(RegisterRequest request) {
        return registerUserWithRole(request, "USER");
    }

    /**
     * Register user with specific role
     */
    public User registerUserWithRole(RegisterRequest request, String roleName) {
        // Validate user doesn't exist
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken: " + request.getUsername());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use: " + request.getEmail());
        }

        // Validate role exists
        Role userRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        // Create user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setIsEnabled(true);

        User savedUser = userRepository.save(user);

        System.out.println("✅ New user registered: " + request.getUsername() + " with role: " + roleName);

        return savedUser;
    }

    /**
     * Initiate password reset
     */
    public boolean initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(24)); // 24 hour expiry

            userRepository.save(user);

            // For now, just log the token (remove in production)
            System.out.println("🔑 Password reset token for " + email + ": " + resetToken);

            return true;
        }

        // Always return true to prevent email enumeration attacks
        return true;
    }

    /**
     * Reset password with token
     */
    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByResetToken(token);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Check if token is not expired
            if (user.getResetTokenExpiry() != null &&
                    user.getResetTokenExpiry().isAfter(LocalDateTime.now())) {

                // Reset password
                user.setPasswordHash(passwordEncoder.encode(newPassword));
                user.setResetToken(null);
                user.setResetTokenExpiry(null);

                userRepository.save(user);

                return true;
            }
        }

        return false;
    }

    /**
     * Change password (authenticated user)
     */
    public boolean changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            return false;
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return true;
    }

    /**
     * Check if user has specific role
     */
    public boolean hasRole(String username, String roleName) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.map(user -> user.getRole().getName().equals(roleName)).orElse(false);
    }

    /**
     * Check if user is admin
     */
    public boolean isAdmin(String username) {
        return hasRole(username, "ADMIN");
    }

    /**
     * Check if user is porteur
     */
    public boolean isPorteur(String username) {
        return hasRole(username, "PORTEUR");
    }

    // Original methods
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}