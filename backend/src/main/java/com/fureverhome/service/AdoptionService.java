package com.fureverhome.service;

import com.fureverhome.dto.AdoptionRequestDTO;
import com.fureverhome.dto.AdoptionResponse;
import com.fureverhome.dto.AdoptionStatusUpdateDTO;
import com.fureverhome.model.AdoptionRequest;
import com.fureverhome.model.Dog;
import com.fureverhome.model.User;
import com.fureverhome.repository.AdoptionRequestRepository;
import com.fureverhome.repository.DogRepository;
import com.fureverhome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdoptionService {

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final DogRepository dogRepository;
    private final UserRepository userRepository;

    @Transactional
    public AdoptionRequest createAdoptionRequest(AdoptionRequestDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dog dog = dogRepository.findById(dto.getDogId())
                .orElseThrow(() -> new RuntimeException("Dog not found with id: " + dto.getDogId()));

        if (!dog.getAvailable()) {
            throw new RuntimeException("Dog is not available for adoption");
        }

        AdoptionRequest request = new AdoptionRequest();
        request.setDog(dog);
        request.setUser(user);
        request.setMessage(dto.getMessage());
        request.setStatus(AdoptionRequest.Status.PENDING);

        // Set detailed applicant information
        request.setFullName(dto.getFullName());
        request.setEmail(dto.getEmail());
        request.setPhone(dto.getPhone());
        request.setAddress(dto.getAddress());
        request.setOccupation(dto.getOccupation());
        request.setHouseholdMembers(dto.getHouseholdMembers());
        request.setHasOtherPets(dto.getHasOtherPets());
        request.setPetExperience(dto.getPetExperience());

        return adoptionRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public List<AdoptionResponse> getAllAdoptionRequests() {
        return adoptionRequestRepository.findAll().stream()
                .map(AdoptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AdoptionResponse> getUserAdoptionRequests(Long userId) {
        return adoptionRequestRepository.findByUserId(userId).stream()
                .map(AdoptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AdoptionResponse> getCurrentUserRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return adoptionRequestRepository.findByUserId(user.getId()).stream()
                .map(AdoptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdoptionRequest getAdoptionRequestById(Long id) {
        return adoptionRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adoption request not found with id: " + id));
    }

    @Transactional
    public AdoptionResponse updateAdoptionStatus(Long id, AdoptionStatusUpdateDTO dto) {
        AdoptionRequest request = getAdoptionRequestById(id);
        request.setStatus(dto.getStatus());

        // If approved, mark dog as unavailable
        if (dto.getStatus() == AdoptionRequest.Status.APPROVED) {
            Dog dog = request.getDog();
            dog.setAvailable(false);
            dogRepository.save(dog);
        }

        AdoptionRequest savedRequest = adoptionRequestRepository.save(request);
        return AdoptionResponse.fromEntity(savedRequest);
    }

    @Transactional
    public void deleteAdoptionRequest(Long id) {
        AdoptionRequest request = getAdoptionRequestById(id);
        adoptionRequestRepository.delete(request);
    }
}
