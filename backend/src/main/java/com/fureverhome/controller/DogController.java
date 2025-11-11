package com.fureverhome.controller;

import com.fureverhome.dto.DogRequest;
import com.fureverhome.model.Dog;
import com.fureverhome.repository.DogRepository;
import com.fureverhome.service.DogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/dogs")
@RequiredArgsConstructor
public class DogController {

    private final DogService dogService;
    private final DogRepository dogRepository;

    @GetMapping
    public ResponseEntity<List<Dog>> getAllDogs(@RequestParam(required = false) Boolean available) {
        List<Dog> dogs;
        if (available != null && available) {
            dogs = dogService.getAvailableDogs();
        } else {
            dogs = dogService.getAllDogs();
        }
        return ResponseEntity.ok(dogs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dog> getDogById(@PathVariable Long id) {
        try {
            Dog dog = dogService.getDogById(id);
            return ResponseEntity.ok(dog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Dog> createDog(
            @RequestParam("name") String name,
            @RequestParam("breed") String breed,
            @RequestParam("age") Integer age,
            @RequestParam("gender") Dog.Gender gender,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("healthStatus") String healthStatus,
            @RequestParam("available") Boolean available,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl) {
        try {
            System.out.println("=== CREATE DOG REQUEST ===");
            System.out.println("Name: " + name);
            System.out.println("Breed: " + breed);
            System.out.println("Image file: " + (image != null ? image.getOriginalFilename() + " (" + image.getSize() + " bytes)" : "null"));
            System.out.println("Image URL: " + imageUrl);

            DogRequest request = new DogRequest(name, breed, age, gender, description, healthStatus, available);
            Dog dog = dogService.createDog(request, image);

            // If no image file but imageUrl provided, set it
            if ((image == null || image.isEmpty()) && imageUrl != null && !imageUrl.isEmpty()) {
                dog.setImageUrl(imageUrl);
                dog = dogRepository.save(dog); // Save again to persist imageUrl
                System.out.println("ImageUrl saved: " + imageUrl);
            }

            System.out.println("Dog created successfully with ID: " + dog.getId());
            System.out.println("Dog has image data: " + (dog.getImage() != null && dog.getImage().length > 0));

            return ResponseEntity.status(HttpStatus.CREATED).body(dog);
        } catch (Exception e) {
            System.err.println("Error creating dog: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Dog> updateDog(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("breed") String breed,
            @RequestParam("age") Integer age,
            @RequestParam("gender") Dog.Gender gender,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("healthStatus") String healthStatus,
            @RequestParam("available") Boolean available,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl) {
        try {
            System.out.println("=== UPDATE DOG REQUEST ===");
            System.out.println("Dog ID: " + id);
            System.out.println("Name: " + name);
            System.out.println("Image file: " + (image != null ? image.getOriginalFilename() + " (" + image.getSize() + " bytes)" : "null"));
            System.out.println("Image URL: " + imageUrl);

            DogRequest request = new DogRequest(name, breed, age, gender, description, healthStatus, available);
            Dog dog = dogService.updateDog(id, request, image);

            // If no image file but imageUrl provided, set it
            if ((image == null || image.isEmpty()) && imageUrl != null && !imageUrl.isEmpty()) {
                dog.setImageUrl(imageUrl);
                dog = dogRepository.save(dog); // Save again to persist imageUrl
                System.out.println("ImageUrl saved: " + imageUrl);
            }

            System.out.println("Dog updated successfully");
            System.out.println("Dog has image data: " + (dog.getImage() != null && dog.getImage().length > 0));

            return ResponseEntity.ok(dog);
        } catch (RuntimeException e) {
            System.err.println("Error updating dog: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDog(@PathVariable Long id) {
        try {
            dogService.deleteDog(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Dog>> searchDogsByBreed(@RequestParam String breed) {
        List<Dog> dogs = dogService.searchByBreed(breed);
        return ResponseEntity.ok(dogs);
    }
}

