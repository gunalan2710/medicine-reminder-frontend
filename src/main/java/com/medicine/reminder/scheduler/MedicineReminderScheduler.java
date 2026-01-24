package com.medicine.reminder.scheduler;

import com.medicine.reminder.entity.DoseLog;
import com.medicine.reminder.entity.Medicine;
import com.medicine.reminder.entity.MedicineScheduleTime;
import com.medicine.reminder.enums.DoseStatus;
import com.medicine.reminder.enums.NotificationChannel;
import com.medicine.reminder.repository.DoseLogRepository;
import com.medicine.reminder.repository.MedicineRepository;
import com.medicine.reminder.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MedicineReminderScheduler {

    private final MedicineRepository medicineRepository;
    private final DoseLogRepository doseLogRepository;
    private final NotificationService notificationService;

    // Runs every minute to check for medicines to take
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void checkAndCreateDoseLogs() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);

        List<Medicine> medicines = medicineRepository.findAll();

        for (Medicine medicine : medicines) {
            // Check date range
            if ((medicine.getStartDate().isBefore(today) || medicine.getStartDate().equals(today)) &&
                    (medicine.getEndDate().isAfter(today) || medicine.getEndDate().equals(today))) {

                for (MedicineScheduleTime scheduleTime : medicine.getScheduleTimes()) {
                    // Check if it's time to remind (e.g. within this minute)
                    if (scheduleTime.getTime().truncatedTo(ChronoUnit.MINUTES).equals(now)) {
                        createDoseLogAndNotify(medicine, today, scheduleTime.getTime());
                    }
                }
            }
        }
    }

    private void createDoseLogAndNotify(Medicine medicine, LocalDate date, LocalTime time) {
        // Prevent duplicates
        if (doseLogRepository.existsByMedicineIdAndDoseDateAndScheduledTime(medicine.getId(), date, time)) {
            return;
        }

        DoseLog logEntry = DoseLog.builder()
                .medicine(medicine)
                .user(medicine.getUser())
                .doseDate(date)
                .scheduledTime(time)
                .status(DoseStatus.PENDING)
                .build();

        doseLogRepository.save(logEntry);
        log.info("Created DoseLog for medicine: {} at {}", medicine.getName(), time);
    }
}
