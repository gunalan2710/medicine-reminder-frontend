package com.medicine.reminder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private long takenToday;
    private long missedToday;
    private long pendingToday;
    private List<DoseLogDTO> todaysDoses;
}
