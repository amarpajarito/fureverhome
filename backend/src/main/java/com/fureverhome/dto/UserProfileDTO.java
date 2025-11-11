package com.fureverhome.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String avatarUrl;
    private String role;
}

