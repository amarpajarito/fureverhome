package com.fureverhome.service;

import com.fureverhome.dto.PasswordUpdateRequest;
import com.fureverhome.dto.UserProfileDTO;
import com.fureverhome.dto.UserProfileUpdateRequest;
import com.fureverhome.model.User;
import com.fureverhome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get user profile by email
     */
    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserProfileDTO dto = convertToDTO(user);
        System.out.println("Getting profile for: " + email + ", Avatar URL: " + dto.getAvatarUrl());
        return dto;
    }

    /**
     * Update user profile
     */
    @Transactional
    public UserProfileDTO updateProfile(String currentEmail, UserProfileUpdateRequest request, MultipartFile avatar) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if new email is already taken by another user
        if (!currentEmail.equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
        }

        // Update basic fields
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());

        // Handle avatar upload
        if (avatar != null && !avatar.isEmpty()) {
            try {
                System.out.println("=== AVATAR UPLOAD FOR USER ===");
                System.out.println("User ID: " + user.getId());
                System.out.println("Avatar filename: " + avatar.getOriginalFilename());
                System.out.println("Avatar size: " + avatar.getSize());
                System.out.println("Avatar content type: " + avatar.getContentType());

                // Store avatar as BLOB in database
                user.setAvatar(avatar.getBytes());
                user.setAvatarContentType(avatar.getContentType());

                System.out.println("Avatar stored in database");
            } catch (IOException e) {
                System.err.println("Failed to upload avatar: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to upload avatar: " + e.getMessage());
            }
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    /**
     * Update user password
     */
    @Transactional
    public void updatePassword(String email, PasswordUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update to new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    /**
     * Convert User entity to DTO
     */
    private UserProfileDTO convertToDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());

        // Generate avatar URL from user ID if avatar exists
        if (user.getAvatar() != null && user.getAvatar().length > 0) {
            dto.setAvatarUrl("/api/avatars/" + user.getId());
        }

        dto.setRole(user.getRole().toString());
        return dto;
    }
}

