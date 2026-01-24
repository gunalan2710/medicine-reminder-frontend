package com.medicine.reminder.controller;

import com.medicine.reminder.dto.ApiResponse;
import com.medicine.reminder.dto.ReportDTO;
import com.medicine.reminder.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<ReportDTO>> getTodayReport() {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Today's report", reportService.getDailyReport(LocalDate.now())));
    }
}
