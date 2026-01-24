package com.medicine.reminder.controller;

import com.medicine.reminder.dto.ApiResponse;
import com.medicine.reminder.dto.UserProfileDTO;
import com.medicine.reminder.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully", userService.getProfile()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(@RequestBody UserProfileDTO dto) {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Profile updated successfully", userService.updateProfile(dto)));
    }
}
