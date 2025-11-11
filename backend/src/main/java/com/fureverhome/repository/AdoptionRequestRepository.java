package com.fureverhome.repository;

import com.fureverhome.model.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
    List<AdoptionRequest> findByUserId(Long userId);
    List<AdoptionRequest> findByDogId(Long dogId);
    List<AdoptionRequest> findByStatus(AdoptionRequest.Status status);
}

