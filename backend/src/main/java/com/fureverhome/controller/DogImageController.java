package com.fureverhome.controller;

import com.fureverhome.model.Dog;
import com.fureverhome.repository.DogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DogImageController {

    private final DogRepository dogRepository;

    /**
     * Get dog image by dog ID
     */
    @GetMapping("/{dogId}/image")
    public ResponseEntity<byte[]> getDogImage(@PathVariable Long dogId) {
        Dog dog = dogRepository.findById(dogId)
                .orElseThrow(() -> new RuntimeException("Dog not found"));

        if (dog.getImage() == null || dog.getImage().length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();

        // Set content type (default to image/png if not specified)
        String contentType = dog.getImageContentType() != null
            ? dog.getImageContentType()
            : "image/png";
        headers.setContentType(MediaType.parseMediaType(contentType));

        // Enable caching
        headers.setCacheControl("max-age=3600");

        return new ResponseEntity<>(dog.getImage(), headers, HttpStatus.OK);
    }
}

