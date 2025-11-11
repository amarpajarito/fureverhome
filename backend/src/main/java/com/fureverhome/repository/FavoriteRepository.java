package com.fureverhome.repository;

import com.fureverhome.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    /**
     * Find all favorites for a specific user
     */
    List<Favorite> findByUserId(Long userId);

    /**
     * Find a specific favorite by user and dog
     */
    Optional<Favorite> findByUserIdAndDogId(Long userId, Long dogId);

    /**
     * Check if a user has favorited a specific dog
     */
    boolean existsByUserIdAndDogId(Long userId, Long dogId);

    /**
     * Delete a favorite by user and dog
     */
    void deleteByUserIdAndDogId(Long userId, Long dogId);

    /**
     * Get all dog IDs favorited by a user
     */
    @Query("SELECT f.dog.id FROM Favorite f WHERE f.user.id = :userId")
    List<Long> findDogIdsByUserId(@Param("userId") Long userId);

    /**
     * Count favorites for a specific dog
     */
    long countByDogId(Long dogId);
}

