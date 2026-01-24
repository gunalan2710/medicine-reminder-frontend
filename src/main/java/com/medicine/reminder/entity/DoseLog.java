package com.medicine.reminder.entity;

import com.medicine.reminder.enums.DoseStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dose_logs")
public class DoseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate doseDate;
    private LocalTime scheduledTime;

    private LocalDateTime actualTakenTime;

    @Enumerated(EnumType.STRING)
    private DoseStatus status; // PENDING, TAKEN, MISSED

    @Builder.Default
    private boolean notified = false;
}
