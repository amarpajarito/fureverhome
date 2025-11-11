package com.fureverhome.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionRequestDTO {
    @NotNull(message = "Dog ID is required")
    private Long dogId;

    private String message;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Occupation is required")
    private String occupation;

    @NotNull(message = "Household members is required")
    @Min(value = 1, message = "At least 1 household member required")
    private Integer householdMembers;

    private Boolean hasOtherPets;

    @NotBlank(message = "Pet experience is required")
    private String petExperience;
}

