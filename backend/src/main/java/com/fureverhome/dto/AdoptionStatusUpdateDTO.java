package com.fureverhome.dto;

import com.fureverhome.model.AdoptionRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionStatusUpdateDTO {
    @NotNull(message = "Status is required")
    private AdoptionRequest.Status status;
}

