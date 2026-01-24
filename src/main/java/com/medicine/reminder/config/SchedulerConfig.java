package com.medicine.reminder.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Additional scheduler configuration like ThreadPoolTaskScheduler can be added
    // here if needed
}
