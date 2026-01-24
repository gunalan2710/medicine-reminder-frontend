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
public class MedicineDTO {
    private Long id;
    private String medicineName;
    private String dosageQty;
    private String description;
    private String medicineType;
    private String frequency;
    private boolean beforeFood;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> scheduleTimes;
}
