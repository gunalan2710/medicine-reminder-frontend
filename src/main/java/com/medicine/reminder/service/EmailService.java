package com.medicine.reminder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendSimpleMessage(String to, String subject, String text) {
        log.info("Attempting to send email to: {} with subject: {}", to, subject);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // Use the actual username from properties as the 'from' address
            // Gmail/Outlook often reject emails if 'from' doesn't match the authenticated
            // user
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            log.info("Email successfully sent to: {}", to);
        } catch (Exception e) {
            log.error("CRITICAL EMAIL FAILURE: Could not send to {}. Reason: {}", to, e.getMessage());
            // Rethrow so the caller (like CaregiverService) knows it failed
            throw new RuntimeException(
                    "Email could not be sent. Please check SMTP settings. Detail: " + e.getMessage());
        }
    }
}
