package com.medicine.reminder.controller;

import com.medicine.reminder.dto.ApiResponse;
import com.medicine.reminder.dto.MedicineDTO;
import com.medicine.reminder.entity.Medicine;
import com.medicine.reminder.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicine")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Medicine>> addMedicine(@RequestBody MedicineDTO dto) {
        Medicine medicine = medicineService.saveMedicine(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Medicine saved successfully", medicine));
    }

    @GetMapping("/myMedicines")
    public ResponseEntity<ApiResponse<List<Medicine>>> getMyMedicines() {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Medicines fetched successfully", medicineService.getMyMedicines()));
    }

    @GetMapping("/{medicineId}")
    public ResponseEntity<ApiResponse<Medicine>> getMedicine(@PathVariable Long medicineId) {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Medicine fetched successfully", medicineService.getMedicine(medicineId)));
    }

    @DeleteMapping("/delete/{medicineId}")
    public ResponseEntity<ApiResponse<Void>> deleteMedicine(@PathVariable Long medicineId) {
        medicineService.deleteMedicine(medicineId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Medicine deleted successfully", null));
    }
}
