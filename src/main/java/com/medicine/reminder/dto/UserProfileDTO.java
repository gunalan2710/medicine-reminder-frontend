package com.medicine.reminder.dto;

import com.medicine.reminder.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private String name;
    private String email;
    private String phone;
    private UserRole role;
    private boolean emailNotificationsEnabled;
    private boolean smsNotificationsEnabled;
}
