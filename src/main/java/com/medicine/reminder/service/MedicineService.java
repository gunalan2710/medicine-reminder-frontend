package com.medicine.reminder.service;

import com.medicine.reminder.dto.MedicineDTO;
import com.medicine.reminder.entity.Medicine;
import com.medicine.reminder.entity.MedicineScheduleTime;
import com.medicine.reminder.entity.User;
import com.medicine.reminder.repository.MedicineRepository;
import com.medicine.reminder.repository.MedicineScheduleTimeRepository;
import com.medicine.reminder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineScheduleTimeRepository scheduleTimeRepository;
    private final UserRepository userRepository;

    @Transactional
    public Medicine saveMedicine(MedicineDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Medicine medicine;
        if (dto.getId() != null) {
            medicine = medicineRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));
            // Clear existing schedule times for update
            scheduleTimeRepository.deleteByMedicineId(medicine.getId());
        } else {
            medicine = new Medicine();
            medicine.setUser(user);
        }

        medicine.setName(dto.getMedicineName());
        medicine.setDosageQty(dto.getDosageQty());
        medicine.setDescription(dto.getDescription());
        medicine.setMedicineType(dto.getMedicineType());
        medicine.setFrequency(dto.getFrequency());
        medicine.setBeforeFood(dto.isBeforeFood());
        medicine.setStartDate(dto.getStartDate());
        medicine.setEndDate(dto.getEndDate());

        Medicine savedMedicine = medicineRepository.save(medicine);

        if (dto.getScheduleTimes() != null) {
            List<MedicineScheduleTime> times = dto.getScheduleTimes().stream()
                    .map(timeStr -> MedicineScheduleTime.builder()
                            .medicine(savedMedicine)
                            .time(LocalTime.parse(timeStr))
                            .build())
                    .collect(Collectors.toList());
            scheduleTimeRepository.saveAll(times);
            savedMedicine.setScheduleTimes(times);
        }
        return savedMedicine;
    }

    public List<Medicine> getMyMedicines() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return medicineRepository.findByUserId(user.getId());
    }

    public Medicine getMedicine(Long id) {
        return medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    @Transactional
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
}
