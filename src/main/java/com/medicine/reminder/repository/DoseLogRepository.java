package com.medicine.reminder.repository;

import com.medicine.reminder.entity.DoseLog;
import com.medicine.reminder.enums.DoseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DoseLogRepository extends JpaRepository<DoseLog, Long> {
        List<DoseLog> findByUserIdAndDoseDate(Long userId, LocalDate doseDate);

        @Query("SELECT d FROM DoseLog d WHERE d.user.id = :userId AND d.doseDate BETWEEN :startDate AND :endDate")
        List<DoseLog> findDosesForReport(@Param("userId") Long userId, @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        // To prevent duplicate log creation
        boolean existsByMedicineIdAndDoseDateAndScheduledTime(Long medicineId, LocalDate doseDate,
                        java.time.LocalTime scheduledTime);

        List<DoseLog> findByStatusAndDoseDateAndScheduledTimeBeforeAndNotifiedFalse(
                        DoseStatus status, LocalDate doseDate, java.time.LocalTime scheduledTime);

        List<DoseLog> findByStatusAndDoseDateAndScheduledTimeBefore(
                        DoseStatus status, LocalDate doseDate, java.time.LocalTime scheduledTime);

        long countByUserIdAndDoseDateAndStatus(Long userId, LocalDate doseDate, DoseStatus status);
}
