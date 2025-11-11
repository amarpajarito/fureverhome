package com.fureverhome.dto;

import com.fureverhome.model.Dog;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DogRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Breed is required")
    @Size(max = 100, message = "Breed cannot exceed 100 characters")
    private String breed;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be a positive number")
    private Integer age;

    @NotNull(message = "Gender is required")
    private Dog.Gender gender;

    private String description;

    @NotBlank(message = "Health status is required")
    @Size(max = 50, message = "Health status cannot exceed 50 characters")
    private String healthStatus;

    @NotNull(message = "Available status is required")
    private Boolean available;
}

