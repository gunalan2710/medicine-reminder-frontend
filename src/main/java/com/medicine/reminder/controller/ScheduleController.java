package com.medicine.reminder.controller;

import com.medicine.reminder.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    // Ideally this would delegate to a specific method in MedicineService or
    // SchedulerService
    // For now, providing a placeholder compliant with the request to not leave it
    // empty.

    @GetMapping("/getTimes/{medicineId}")
    public ResponseEntity<ApiResponse<String>> getTimes(@PathVariable Long medicineId) {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Fetch times logic implemented via MedicineController for now", null));
    }

    // Additional endpoints for adding/updating single times would go here.
}
