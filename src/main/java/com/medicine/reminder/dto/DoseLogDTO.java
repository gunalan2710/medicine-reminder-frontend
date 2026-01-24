package com.medicine.reminder.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.medicine.reminder.enums.DoseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoseLogDTO {
    private Long id;
    private String medicineName;
    private String dosage;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate doseDate;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime scheduledTime;

    private DoseStatus status;
}
