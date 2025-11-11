package com.fureverhome.dto;

import com.fureverhome.model.AdoptionRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionResponse {
    private Long id;
    private Long dogId;
    private String dogName;
    private String dogBreed;
    private String dogImageUrl;
    private Long userId;
    private String username;
    private String userEmail;
    private String status;
    private String message;
    private String reason; // Alias for message field for frontend compatibility

    // Detailed applicant information
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String occupation;
    private Integer householdMembers;
    private Boolean hasOtherPets;
    private String petExperience;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdoptionResponse fromEntity(AdoptionRequest request) {
        AdoptionResponse response = new AdoptionResponse();
        response.setId(request.getId());
        response.setDogId(request.getDog().getId());
        response.setDogName(request.getDog().getName());
        response.setDogBreed(request.getDog().getBreed());
        
        // Set dog image URL - prioritize binary image over imageUrl field
        if (request.getDog().hasImage()) {
            response.setDogImageUrl("/api/dogs/" + request.getDog().getId() + "/image");
        } else if (request.getDog().getImageUrl() != null && !request.getDog().getImageUrl().isEmpty()) {
            response.setDogImageUrl(request.getDog().getImageUrl());
        }
        
        response.setUserId(request.getUser().getId());
        response.setUsername(request.getUser().getUsername());
        response.setUserEmail(request.getUser().getEmail());
        response.setStatus(request.getStatus().name());
        response.setMessage(request.getMessage());
        response.setReason(request.getMessage() != null ? request.getMessage() : request.getPetExperience());

        // Set detailed applicant information
        response.setFullName(request.getFullName());
        response.setEmail(request.getEmail());
        response.setPhone(request.getPhone());
        response.setAddress(request.getAddress());
        response.setOccupation(request.getOccupation());
        response.setHouseholdMembers(request.getHouseholdMembers());
        response.setHasOtherPets(request.getHasOtherPets());
        response.setPetExperience(request.getPetExperience());

        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        return response;
    }
}

