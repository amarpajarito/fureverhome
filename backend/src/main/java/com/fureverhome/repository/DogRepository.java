package com.fureverhome.repository;

import com.fureverhome.model.Dog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DogRepository extends JpaRepository<Dog, Long> {
    List<Dog> findByAvailable(Boolean available);
    List<Dog> findByBreedContainingIgnoreCase(String breed);
}

