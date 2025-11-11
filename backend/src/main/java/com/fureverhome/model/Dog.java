package com.fureverhome.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String breed;

    @Column(nullable = false)
    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50, name = "health_status")
    private String healthStatus = "Healthy";

    @Column(length = 255, name = "image_url")
    private String imageUrl;

    @JsonIgnore // Don't serialize the actual binary data in JSON responses
    @Column(name = "image", columnDefinition = "BYTEA")
    private byte[] image;

    @Column(name = "image_content_type", length = 100)
    private String imageContentType;

    @Column(nullable = false)
    private Boolean available = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false, name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false, name = "updated_at")
    private LocalDateTime updatedAt;

    // Computed property to indicate if image exists (without sending binary data)
    @JsonProperty("hasImage")
    public boolean hasImage() {
        return image != null && image.length > 0;
    }

    public enum Gender {
        MALE,
        FEMALE
    }
}

