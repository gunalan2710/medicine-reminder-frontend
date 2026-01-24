package com.medicine.reminder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportDTO {
    private LocalDate date;
    private int totalDoses;
    private int takenDoses;
    private int missedDoses;
    private double adherenceScore;
    private List<DoseLogDTO> doses;
}
