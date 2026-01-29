package com.medicine.reminder.service;

import com.medicine.reminder.entity.DoseLog;
import com.medicine.reminder.entity.User;
import com.medicine.reminder.enums.DoseStatus;
import com.medicine.reminder.repository.DoseLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class SchedulerService {

    private final DoseLogRepository doseLogRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 * * * * *") // Run every minute
    @Transactional
    public void scheduleReminders() {
        log.info("Checking for due reminders at {}", LocalTime.now());

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<DoseLog> dueDoses = doseLogRepository.findByStatusAndDoseDateAndScheduledTimeBeforeAndNotifiedFalse(
                DoseStatus.PENDING, today, now);

        for (DoseLog dose : dueDoses) {
            try {
                User user = dose.getUser();
                String medicineName = dose.getMedicine().getName();
                String time = dose.getScheduledTime().toString();

                log.info("Processing reminder for {} to user {}", medicineName, user.getEmail());

                if (user.isEmailNotificationsEnabled()) {
                    sendEmailReminder(user, medicineName, time);
                }

//                if (user.isSmsNotificationsEnabled() && user.getPhone() != null) {
//                    sendSmsReminder(user, medicineName, time);
//                }

                dose.setNotified(true);
                doseLogRepository.save(dose);
            } catch (Exception e) {
                log.error("Failed to process reminder for dose {}: {}", dose.getId(), e.getMessage());
                // We don't mark as notified if it failed, so it can retry or show as error
            }
        }
    }

    @Scheduled(cron = "0 */15 * * * *") // Run every 15 minutes
    @Transactional
    public void checkMissedDoses() {
        log.info("Checking for missed doses at {}", LocalTime.now());

        LocalDate today = LocalDate.now();
        LocalTime thirtyMinsAgo = LocalTime.now().minusMinutes(30);

        // Find PENDING doses that were scheduled more than 30 minutes ago
        List<DoseLog> pendingDoses = doseLogRepository.findByStatusAndDoseDateAndScheduledTimeBefore(
                DoseStatus.PENDING, today, thirtyMinsAgo);

        for (DoseLog dose : pendingDoses) {
            log.warn("Marking dose {} as MISSED for user {}", dose.getId(), dose.getUser().getEmail());
            dose.setStatus(DoseStatus.MISSED);
            doseLogRepository.save(dose);

            // Optional: Notify caregiver if needed
            String message = String.format("Alert: %s missed their medicine %s scheduled for %s",
                    dose.getUser().getName(), dose.getMedicine().getName(), dose.getScheduledTime());

            // This is where you'd notify caregivers
            notificationService.sendEmail(dose.getUser().getEmail(), "Missed Medicine Alert", message);
        }
    }

    private void sendEmailReminder(User user, String medicineName, String time) {
        String subject = "Medicine Reminder: " + medicineName;
        String body = String.format(
                "Hi %s,\n\nIt's time to take your medicine: %s scheduled for %s.\n\nPlease log in to mark it as taken.\n\nBe healthy!\nMedicine Reminder System",
                user.getName(), medicineName, time);
        notificationService.sendEmail(user.getEmail(), subject, body);
    }

//    private void sendSmsReminder(User user, String medicineName, String time) {
//        String body = String.format("Medicine Reminder: Time to take %s (%s). Please update your log.",
//                medicineName, time);
//        notificationService.sendSms(user.getPhone(), body);
//    }
}
