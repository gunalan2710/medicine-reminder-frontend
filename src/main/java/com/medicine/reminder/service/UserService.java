package com.medicine.reminder.service;

import com.medicine.reminder.dto.UserProfileDTO;
import com.medicine.reminder.entity.User;
import com.medicine.reminder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileDTO getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        return UserProfileDTO.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .emailNotificationsEnabled(user.isEmailNotificationsEnabled())
                .smsNotificationsEnabled(user.isSmsNotificationsEnabled())
                .build();
    }

    public UserProfileDTO updateProfile(UserProfileDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setEmailNotificationsEnabled(dto.isEmailNotificationsEnabled());
        user.setSmsNotificationsEnabled(dto.isSmsNotificationsEnabled());

        User savedUser = userRepository.save(user);

        return UserProfileDTO.builder()
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole())
                .emailNotificationsEnabled(savedUser.isEmailNotificationsEnabled())
                .smsNotificationsEnabled(savedUser.isSmsNotificationsEnabled())
                .build();
    }
}
