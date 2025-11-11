package com.fureverhome.controller;

import com.fureverhome.dto.AdoptionRequestDTO;
import com.fureverhome.dto.AdoptionResponse;
import com.fureverhome.dto.AdoptionStatusUpdateDTO;
import com.fureverhome.model.AdoptionRequest;
import com.fureverhome.service.AdoptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/adoption-requests")
@RequiredArgsConstructor
public class AdoptionController {

    private final AdoptionService adoptionService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<AdoptionRequest> createAdoptionRequest(@Valid @RequestBody AdoptionRequestDTO dto) {
        try {
            AdoptionRequest request = adoptionService.createAdoptionRequest(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdoptionResponse>> getAllAdoptionRequests() {
        List<AdoptionResponse> requests = adoptionService.getAllAdoptionRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdoptionResponse>> getUserAdoptionRequests(@PathVariable Long userId) {
        List<AdoptionResponse> requests = adoptionService.getUserAdoptionRequests(userId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<AdoptionResponse>> getCurrentUserRequests() {
        List<AdoptionResponse> requests = adoptionService.getCurrentUserRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<AdoptionRequest> getAdoptionRequestById(@PathVariable Long id) {
        try {
            AdoptionRequest request = adoptionService.getAdoptionRequestById(id);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdoptionResponse> updateAdoptionStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdoptionStatusUpdateDTO dto) {
        try {
            AdoptionResponse response = adoptionService.updateAdoptionStatus(id, dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> patchAdoptionStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdoptionStatusUpdateDTO dto) {
        try {
            System.out.println("Received PATCH request for adoption request ID: " + id);
            System.out.println("Status update DTO: " + dto);
            System.out.println("Status value: " + dto.getStatus());

            AdoptionResponse response = adoptionService.updateAdoptionStatus(id, dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Error updating adoption status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(404).body(Map.of(
                "error", e.getMessage(),
                "id", id
            ));
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAdoptionRequest(@PathVariable Long id) {
        try {
            adoptionService.deleteAdoptionRequest(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
