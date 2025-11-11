package com.fureverhome.service;

import com.fureverhome.dto.DogRequest;
import com.fureverhome.model.Dog;
import com.fureverhome.repository.DogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DogService {

    private final DogRepository dogRepository;

    @Transactional(readOnly = true)
    public List<Dog> getAllDogs() {
        return dogRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Dog> getAvailableDogs() {
        return dogRepository.findByAvailable(true);
    }

    @Transactional(readOnly = true)
    public Dog getDogById(Long id) {
        return dogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dog not found with id: " + id));
    }

    @Transactional
    public Dog createDog(DogRequest request, MultipartFile image) {
        Dog dog = new Dog();
        dog.setName(request.getName());
        dog.setBreed(request.getBreed());
        dog.setAge(request.getAge());
        dog.setGender(request.getGender());
        dog.setDescription(request.getDescription());
        dog.setHealthStatus(request.getHealthStatus());
        dog.setAvailable(request.getAvailable());

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            try {
                System.out.println("=== DOG IMAGE UPLOAD ===");
                System.out.println("Image filename: " + image.getOriginalFilename());
                System.out.println("Image size: " + image.getSize());
                System.out.println("Image content type: " + image.getContentType());

                dog.setImage(image.getBytes());
                dog.setImageContentType(image.getContentType());

                System.out.println("Dog image stored in database");
            } catch (IOException e) {
                System.err.println("Failed to upload dog image: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to upload dog image: " + e.getMessage());
            }
        }

        return dogRepository.save(dog);
    }

    @Transactional
    public Dog updateDog(Long id, DogRequest request, MultipartFile image) {
        Dog dog = getDogById(id);

        dog.setName(request.getName());
        dog.setBreed(request.getBreed());
        dog.setAge(request.getAge());
        dog.setGender(request.getGender());
        dog.setDescription(request.getDescription());
        dog.setHealthStatus(request.getHealthStatus());
        dog.setAvailable(request.getAvailable());

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            try {
                System.out.println("=== DOG IMAGE UPDATE ===");
                System.out.println("Dog ID: " + id);
                System.out.println("Image filename: " + image.getOriginalFilename());
                System.out.println("Image size: " + image.getSize());

                dog.setImage(image.getBytes());
                dog.setImageContentType(image.getContentType());

                System.out.println("Dog image updated in database");
            } catch (IOException e) {
                System.err.println("Failed to update dog image: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to update dog image: " + e.getMessage());
            }
        }

        return dogRepository.save(dog);
    }

    @Transactional
    public void deleteDog(Long id) {
        Dog dog = getDogById(id);
        dogRepository.delete(dog);
    }

    @Transactional(readOnly = true)
    public List<Dog> searchByBreed(String breed) {
        return dogRepository.findByBreedContainingIgnoreCase(breed);
    }
}

