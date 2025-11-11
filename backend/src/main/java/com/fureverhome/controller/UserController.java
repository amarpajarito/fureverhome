package com.fureverhome.controller;

import com.fureverhome.dto.PasswordUpdateRequest;
import com.fureverhome.dto.UserProfileDTO;
import com.fureverhome.dto.UserProfileUpdateRequest;
import com.fureverhome.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get current user's profile
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Authentication authentication) {
        String email = getUserEmailFromAuthentication(authentication);
        UserProfileDTO profile = userService.getUserProfile(email);
        return ResponseEntity.ok(profile);
    }

    /**
     * Update user profile (with optional avatar upload)
     */
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            Authentication authentication,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("address") String address,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {

        String currentEmail = getUserEmailFromAuthentication(authentication);

        // Create request object
        UserProfileUpdateRequest request = new UserProfileUpdateRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        request.setPhoneNumber(phoneNumber);
        request.setAddress(address);

        try {
            UserProfileDTO updatedProfile = userService.updateProfile(currentEmail, request, avatar);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * Update user password
     */
    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> updatePassword(
            Authentication authentication,
            @Valid @RequestBody PasswordUpdateRequest request) {

        String email = getUserEmailFromAuthentication(authentication);

        try {
            userService.updatePassword(email, request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password updated successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * Helper method to extract email from authentication
     */
    private String getUserEmailFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername(); // Username is email in our system
    }
}

