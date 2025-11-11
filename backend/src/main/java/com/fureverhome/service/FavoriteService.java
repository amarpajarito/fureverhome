package com.fureverhome.service;

import com.fureverhome.model.Dog;
import com.fureverhome.model.Favorite;
import com.fureverhome.model.User;
import com.fureverhome.repository.DogRepository;
import com.fureverhome.repository.FavoriteRepository;
import com.fureverhome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final DogRepository dogRepository;

    /**
     * Get all favorite dog IDs for a user
     */
    public List<Long> getUserFavoriteDogIds(Long userId) {
        return favoriteRepository.findDogIdsByUserId(userId);
    }

    /**
     * Get all favorites for a user (full Favorite objects)
     */
    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    /**
     * Add a dog to user's favorites
     */
    @Transactional
    public Favorite addFavorite(Long userId, Long dogId) {
        // Check if already favorited
        if (favoriteRepository.existsByUserIdAndDogId(userId, dogId)) {
            throw new RuntimeException("Dog is already in favorites");
        }

        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate dog exists
        Dog dog = dogRepository.findById(dogId)
                .orElseThrow(() -> new RuntimeException("Dog not found"));

        // Create favorite
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setDog(dog);

        return favoriteRepository.save(favorite);
    }

    /**
     * Remove a dog from user's favorites
     */
    @Transactional
    public void removeFavorite(Long userId, Long dogId) {
        if (!favoriteRepository.existsByUserIdAndDogId(userId, dogId)) {
            throw new RuntimeException("Favorite not found");
        }
        favoriteRepository.deleteByUserIdAndDogId(userId, dogId);
    }

    /**
     * Check if a dog is in user's favorites
     */
    public boolean isFavorite(Long userId, Long dogId) {
        return favoriteRepository.existsByUserIdAndDogId(userId, dogId);
    }

    /**
     * Get count of how many users favorited a specific dog
     */
    public long getFavoriteCount(Long dogId) {
        return favoriteRepository.countByDogId(dogId);
    }

    /**
     * Remove all favorites for a dog (when dog is deleted)
     */
    @Transactional
    public void removeAllFavoritesForDog(Long dogId) {
        List<Favorite> favorites = favoriteRepository.findAll().stream()
                .filter(f -> f.getDog().getId().equals(dogId))
                .toList();
        favoriteRepository.deleteAll(favorites);
    }
}

