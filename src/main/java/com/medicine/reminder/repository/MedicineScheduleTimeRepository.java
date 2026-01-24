package com.medicine.reminder.repository;

import com.medicine.reminder.entity.MedicineScheduleTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineScheduleTimeRepository extends JpaRepository<MedicineScheduleTime, Long> {
    @org.springframework.transaction.annotation.Transactional
    void deleteByMedicineId(Long medicineId);
}
