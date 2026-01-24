package com.medicine.reminder.service;

import com.medicine.reminder.dto.DoseLogDTO;
import com.medicine.reminder.dto.ReportDTO;
import com.medicine.reminder.entity.DoseLog;
import com.medicine.reminder.entity.User;
import com.medicine.reminder.enums.DoseStatus;
import com.medicine.reminder.repository.DoseLogRepository;
import com.medicine.reminder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final DoseLogRepository doseLogRepository;
    private final UserRepository userRepository;

    public ReportDTO getDailyReport(LocalDate date) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<DoseLog> logs = doseLogRepository.findByUserIdAndDoseDate(user.getId(), date);

        List<DoseLogDTO> doseDTOs = logs.stream()
                .map(log -> DoseLogDTO.builder()
                        .id(log.getId())
                        .medicineName(log.getMedicine().getName())
                        .dosage(log.getMedicine().getDosageQty())
                        .doseDate(log.getDoseDate())
                        .scheduledTime(log.getScheduledTime())
                        .status(log.getStatus())
                        .build())
                .collect(Collectors.toList());

        int total = logs.size();
        int taken = (int) logs.stream().filter(l -> l.getStatus() == DoseStatus.TAKEN).count();
        int missed = (int) logs.stream().filter(l -> l.getStatus() == DoseStatus.MISSED).count();
        double score = total == 0 ? 0 : ((double) taken / total) * 100;

        return ReportDTO.builder()
                .date(date)
                .totalDoses(total)
                .takenDoses(taken)
                .missedDoses(missed)
                .adherenceScore(score)
                .doses(doseDTOs)
                .build();
    }
}
