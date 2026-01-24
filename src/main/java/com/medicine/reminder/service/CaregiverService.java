package com.medicine.reminder.service;

import com.medicine.reminder.dto.DoseLogDTO;
import com.medicine.reminder.dto.PatientSummaryDTO;
import com.medicine.reminder.entity.CaregiverMapping;
import com.medicine.reminder.entity.DoseLog;
import com.medicine.reminder.entity.User;
import com.medicine.reminder.enums.DoseStatus;
import com.medicine.reminder.enums.UserRole;
import com.medicine.reminder.repository.CaregiverMappingRepository;
import com.medicine.reminder.repository.DoseLogRepository;
import com.medicine.reminder.repository.MedicineRepository;
import com.medicine.reminder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaregiverService {

        private final CaregiverMappingRepository caregiverMappingRepository;
        private final UserRepository userRepository;
        private final DoseLogRepository doseLogRepository;
        private final MedicineRepository medicineRepository;
        private final NotificationService notificationService;
        private final EmailService emailService;

        public void addPatient(String patientEmail) {
                String caregiverEmail = SecurityContextHolder.getContext().getAuthentication().getName();
                User caregiver = userRepository.findByEmail(caregiverEmail)
                                .orElseThrow(() -> new RuntimeException("Caregiver not found"));

                if (caregiver.getRole() != UserRole.CAREGIVER) {
                        throw new RuntimeException("Only caregivers can add patients");
                }

                User patient = userRepository.findByEmail(patientEmail)
                                .orElseThrow(() -> new RuntimeException("Patient email not found"));

                if (caregiverMappingRepository.existsByCaregiverIdAndPatientId(caregiver.getId(), patient.getId())) {
                        throw new RuntimeException("Mapping already exists");
                }

                CaregiverMapping mapping = CaregiverMapping.builder()
                                .caregiver(caregiver)
                                .patient(patient)
                                .build();

                caregiverMappingRepository.save(mapping);
        }

        public List<User> getPatients() {
                String caregiverEmail = SecurityContextHolder.getContext().getAuthentication().getName();
                User caregiver = userRepository.findByEmail(caregiverEmail)
                                .orElseThrow(() -> new RuntimeException("Caregiver not found"));

                return caregiverMappingRepository.findByCaregiverId(caregiver.getId()).stream()
                                .map(com.medicine.reminder.entity.CaregiverMapping::getPatient)
                                .collect(Collectors.toList());
        }

        public List<PatientSummaryDTO> getPatientsSummary() {
                String caregiverEmail = SecurityContextHolder.getContext().getAuthentication().getName();
                User caregiver = userRepository.findByEmail(caregiverEmail)
                                .orElseThrow(() -> new RuntimeException("Caregiver not found"));

                LocalDate today = LocalDate.now();

                return caregiverMappingRepository.findByCaregiverId(caregiver.getId()).stream()
                                .map(mapping -> {
                                        User patient = mapping.getPatient();

                                        // Ensure dose logs exist for today
                                        ensureDosesGenerated(patient);

                                        long taken = doseLogRepository.countByUserIdAndDoseDateAndStatus(
                                                        patient.getId(), today,
                                                        DoseStatus.TAKEN);
                                        long missed = doseLogRepository.countByUserIdAndDoseDateAndStatus(
                                                        patient.getId(), today,
                                                        DoseStatus.MISSED);
                                        long pending = doseLogRepository.countByUserIdAndDoseDateAndStatus(
                                                        patient.getId(), today,
                                                        DoseStatus.PENDING);

                                        List<DoseLogDTO> todaysDoses = doseLogRepository
                                                        .findByUserIdAndDoseDate(patient.getId(), today)
                                                        .stream()
                                                        .map(log -> DoseLogDTO.builder()
                                                                        .id(log.getId())
                                                                        .medicineName(log.getMedicine().getName())
                                                                        .dosage(log.getMedicine().getDosageQty())
                                                                        .doseDate(log.getDoseDate())
                                                                        .scheduledTime(log.getScheduledTime())
                                                                        .status(log.getStatus())
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        return PatientSummaryDTO.builder()
                                                        .id(patient.getId())
                                                        .name(patient.getName())
                                                        .email(patient.getEmail())
                                                        .takenToday(taken)
                                                        .missedToday(missed)
                                                        .pendingToday(pending)
                                                        .todaysDoses(todaysDoses)
                                                        .build();
                                })
                                .collect(Collectors.toList());
        }

        public void triggerManualReminder(Long patientId, Long doseLogId) {
                String caregiverEmail = SecurityContextHolder.getContext().getAuthentication().getName();
                User caregiver = userRepository.findByEmail(caregiverEmail)
                                .orElseThrow(() -> new RuntimeException("Caregiver not found"));

                User patient = userRepository.findById(patientId)
                                .orElseThrow(() -> new RuntimeException("Patient not found"));

                // Verify mapping using IDs
                if (!caregiverMappingRepository.existsByCaregiverIdAndPatientId(caregiver.getId(), patient.getId())) {
                        throw new RuntimeException("You are not assigned to this patient");
                }

                DoseLog dose = null;
                if (doseLogId != null && doseLogId > 0) {
                        dose = doseLogRepository.findById(doseLogId)
                                        .orElseThrow(() -> new RuntimeException("Dose not found"));
                } else {
                        // Find first pending dose for today
                        List<DoseLog> pending = doseLogRepository
                                        .findByUserIdAndDoseDate(patient.getId(), LocalDate.now())
                                        .stream()
                                        .filter(d -> d.getStatus() == DoseStatus.PENDING)
                                        .collect(Collectors.toList());
                        if (!pending.isEmpty()) {
                                dose = pending.get(0);
                        }
                }

                String medicineInfo = (dose != null) ? "medicine: " + dose.getMedicine().getName() : "your medications";
                String timeInfo = (dose != null) ? " scheduled for " + dose.getScheduledTime() : "";

                String message = String.format(
                                "Hi %s,\n\nYour caregiver %s is sending you an urgent reminder to take %s%s.\n\nPlease log in to the Medicine Reminder system to mark it as taken.\n\nSent via caregiver email: %s",
                                patient.getName(), caregiver.getName(), medicineInfo, timeInfo, caregiver.getEmail());

                notificationService.sendEmail(patient.getEmail(), "Urgent Medicine Reminder (from Caregiver)", message);
        }

        public void removePatient(Long patientId) {
                String caregiverEmail = SecurityContextHolder.getContext().getAuthentication().getName();
                User caregiver = userRepository.findByEmail(caregiverEmail)
                                .orElseThrow(() -> new RuntimeException("Caregiver not found"));

                caregiverMappingRepository.deleteByCaregiverIdAndPatientId(caregiver.getId(), patientId);
        }

        private void ensureDosesGenerated(User patient) {
                LocalDate today = LocalDate.now();
                medicineRepository.findByUserId(patient.getId()).forEach(medicine -> {
                        // For each medicine schedule time
                        medicine.getScheduleTimes().forEach(scheduleTime -> {
                                // If log for today and this time doesn't exist, create it
                                if (!doseLogRepository.existsByMedicineIdAndDoseDateAndScheduledTime(
                                                medicine.getId(), today, scheduleTime.getTime())) {
                                        DoseLog logEntry = DoseLog.builder()
                                                        .medicine(medicine)
                                                        .user(patient)
                                                        .doseDate(today)
                                                        .scheduledTime(scheduleTime.getTime())
                                                        .status(DoseStatus.PENDING)
                                                        .build();
                                        doseLogRepository.save(logEntry);
                                }
                        });
                });
        }
}
