package com.medicine.reminder.entity;

import com.medicine.reminder.enums.NotificationChannel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification_logs")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationChannel channel;

    private LocalDateTime sentAt;
    private boolean tempSuccess; // 'success' is reserved keyword in some DBs, safe to use other name or use
                                 // @Column

    @Column(name = "is_success")
    private boolean success;
}
