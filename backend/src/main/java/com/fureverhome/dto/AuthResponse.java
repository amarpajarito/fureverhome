package com.fureverhome.dto;

import com.fureverhome.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String avatarUrl;

    public AuthResponse(String token, Long id, String username, String email, User.Role role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role.name();
    }

    public AuthResponse(String token, Long id, String username, String email, User.Role role,
                       String firstName, String lastName, String avatarUrl) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role.name();
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = avatarUrl;
    }
}

