package com.medicine.reminder.controller;

import com.medicine.reminder.dto.ApiResponse;
import com.medicine.reminder.dto.PatientSummaryDTO;
import com.medicine.reminder.entity.User;
import com.medicine.reminder.service.CaregiverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/caregiver")
@RequiredArgsConstructor
public class CaregiverController {

    private final CaregiverService caregiverService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<String>> addPatient(@RequestBody Map<String, String> request) {
        caregiverService.addPatient(request.get("email"));
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient added successfully", null));
    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<User>>> getPatients() {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Patients fetched successfully", caregiverService.getPatients()));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<List<com.medicine.reminder.dto.PatientSummaryDTO>>> getPatientsSummary() {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Patient summaries fetched", caregiverService.getPatientsSummary()));
    }

    @PostMapping("/trigger-reminder/{patientId}/{doseLogId}")
    public ResponseEntity<ApiResponse<String>> triggerReminder(@PathVariable Long patientId,
            @PathVariable Long doseLogId) {
        caregiverService.triggerManualReminder(patientId, doseLogId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reminder sent to patient", null));
    }

    @DeleteMapping("/remove-patient/{patientId}")
    public ResponseEntity<ApiResponse<Void>> removePatient(@PathVariable Long patientId) {
        caregiverService.removePatient(patientId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient removed from your list", null));
    }
}
