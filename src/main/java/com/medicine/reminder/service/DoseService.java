package com.medicine.reminder.service;

import com.medicine.reminder.entity.DoseLog;
import com.medicine.reminder.entity.User;
import com.medicine.reminder.enums.DoseStatus;
import com.medicine.reminder.repository.DoseLogRepository;
import com.medicine.reminder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DoseService {

    private final DoseLogRepository doseLogRepository;
    private final UserRepository userRepository;

    public DoseLog markDose(Long doseId, DoseStatus status) {
        DoseLog logEntry = doseLogRepository.findById(doseId)
                .orElseThrow(() -> new RuntimeException("Dose Log not found"));

        // Verify user ownership
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!logEntry.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to dose log");
        }

        logEntry.setStatus(status);
        if (status == DoseStatus.TAKEN) {
            logEntry.setActualTakenTime(LocalDateTime.now());
        }
        return doseLogRepository.save(logEntry);
    }
}
