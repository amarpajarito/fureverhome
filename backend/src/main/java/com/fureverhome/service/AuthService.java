package com.fureverhome.service;

import com.fureverhome.dto.AuthResponse;
import com.fureverhome.dto.LoginRequest;
import com.fureverhome.dto.RegisterRequest;
import com.fureverhome.model.User;
import com.fureverhome.repository.UserRepository;
import com.fureverhome.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);

        User savedUser = userRepository.save(user);

        // Generate token
        String token = tokenProvider.generateTokenFromUsername(savedUser.getEmail());

        // Generate avatar URL if avatar exists
        String avatarUrl = null;
        if (savedUser.getAvatar() != null && savedUser.getAvatar().length > 0) {
            avatarUrl = "/api/avatars/" + savedUser.getId();
        }

        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(),
                savedUser.getEmail(), savedUser.getRole(), savedUser.getFirstName(),
                savedUser.getLastName(), avatarUrl);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate avatar URL if avatar exists
        String avatarUrl = null;
        if (user.getAvatar() != null && user.getAvatar().length > 0) {
            avatarUrl = "/api/avatars/" + user.getId();
        }

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(),
                user.getRole(), user.getFirstName(), user.getLastName(), avatarUrl);
    }
}

