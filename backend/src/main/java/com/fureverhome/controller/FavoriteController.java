package com.fureverhome.controller;

import com.fureverhome.model.Favorite;
import com.fureverhome.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final com.fureverhome.repository.UserRepository userRepository;

    /**
     * Get current user's favorite dog IDs
     */
    @GetMapping
    public ResponseEntity<List<Long>> getUserFavorites(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<Long> favoriteDogIds = favoriteService.getUserFavoriteDogIds(userId);
        return ResponseEntity.ok(favoriteDogIds);
    }

    /**
     * Add a dog to favorites
     */
    @PostMapping("/{dogId}")
    public ResponseEntity<Void> addFavorite(
            @PathVariable Long dogId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            favoriteService.addFavorite(userId, dogId);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("already in favorites")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Remove a dog from favorites
     */
    @DeleteMapping("/{dogId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long dogId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            favoriteService.removeFavorite(userId, dogId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Check if a dog is favorited by current user
     */
    @GetMapping("/check/{dogId}")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable Long dogId,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        boolean isFavorite = favoriteService.isFavorite(userId, dogId);
        return ResponseEntity.ok(isFavorite);
    }

    /**
     * Get favorite count for a specific dog
     */
    @GetMapping("/count/{dogId}")
    public ResponseEntity<Long> getFavoriteCount(@PathVariable Long dogId) {
        long count = favoriteService.getFavoriteCount(dogId);
        return ResponseEntity.ok(count);
    }

    /**
     * Helper method to extract user ID from authentication
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}

