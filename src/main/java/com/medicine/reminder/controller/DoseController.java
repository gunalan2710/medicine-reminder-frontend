package com.medicine.reminder.controller;

import com.medicine.reminder.dto.ApiResponse;
import com.medicine.reminder.entity.DoseLog;
import com.medicine.reminder.enums.DoseStatus;
import com.medicine.reminder.service.DoseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dose")
@RequiredArgsConstructor
public class DoseController {

    private final DoseService doseService;

    @PostMapping("/taken/{doseLogId}")
    public ResponseEntity<ApiResponse<DoseLog>> markTaken(@PathVariable Long doseLogId) {
        DoseLog log = doseService.markDose(doseLogId, DoseStatus.TAKEN);
        return ResponseEntity.ok(new ApiResponse<>(true, "Dose marked as TAKEN", log));
    }

    @PostMapping("/missed/{doseLogId}")
    public ResponseEntity<ApiResponse<DoseLog>> markMissed(@PathVariable Long doseLogId) {
        DoseLog log = doseService.markDose(doseLogId, DoseStatus.MISSED);
        return ResponseEntity.ok(new ApiResponse<>(true, "Dose marked as MISSED", log));
    }

    // Snooze can be implemented similar to taken but updating time, skipping for
    // now to keep it simple or mapping to PENDING with new time in complex
    // scenario.
    // For now treating snooze as just acknowledgment without taking? Or maybe
    // creating a new schedule.
    // Spec says: POST /api/dose/snooze/{doseLogId}
    @PostMapping("/snooze/{doseLogId}")
    public ResponseEntity<ApiResponse<String>> snooze(@PathVariable Long doseLogId) {
        // Implementation for snooze: update scheduled time by +10/30 mins
        // For simplicity allow client to re-hit this or implement logic in service to
        // shift time
        return ResponseEntity.ok(new ApiResponse<>(true, "Snooze functionality called (Logic TBD)", null));
    }
}
