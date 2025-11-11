package com.fureverhome.controller;

import com.fureverhome.model.User;
import com.fureverhome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/avatars")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AvatarController {

    private final UserRepository userRepository;

    /**
     * Get user avatar by user ID
     */
    @GetMapping("/{userId}")
    public ResponseEntity<byte[]> getAvatar(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getAvatar() == null || user.getAvatar().length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();

        // Set content type (default to image/png if not specified)
        String contentType = user.getAvatarContentType() != null
            ? user.getAvatarContentType()
            : "image/png";
        headers.setContentType(MediaType.parseMediaType(contentType));

        // Enable caching
        headers.setCacheControl("max-age=3600");

        return new ResponseEntity<>(user.getAvatar(), headers, HttpStatus.OK);
    }
}

