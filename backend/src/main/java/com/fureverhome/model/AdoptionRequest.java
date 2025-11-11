package com.fureverhome.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "adoption_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dog_id", nullable = false)
    private Dog dog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(columnDefinition = "TEXT")
    private String message;

    // Detailed applicant information
    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String occupation;

    @Column(name = "household_members")
    private Integer householdMembers;

    @Column(name = "has_other_pets")
    private Boolean hasOtherPets;

    @Column(name = "pet_experience", columnDefinition = "TEXT")
    private String petExperience;

    @CreationTimestamp
    @Column(nullable = false, updatable = false, name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false, name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }
}

