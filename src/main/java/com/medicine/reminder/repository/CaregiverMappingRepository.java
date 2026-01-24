package com.medicine.reminder.repository;

import com.medicine.reminder.entity.CaregiverMapping;
import com.medicine.reminder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CaregiverMappingRepository extends JpaRepository<CaregiverMapping, Long> {
    List<CaregiverMapping> findByCaregiverId(Long caregiverId);

    boolean existsByCaregiverIdAndPatientId(Long caregiverId, Long patientId);

    @org.springframework.transaction.annotation.Transactional
    void deleteByCaregiverIdAndPatientId(Long caregiverId, Long patientId);
}
