package com.medicine.reminder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final EmailService emailService;
    private final SmsService smsService;
    private final WhatsAppService whatsAppService;

    public void sendEmail(String to, String subject, String body) {
        log.info("Sending email to {}", to);
        emailService.sendSimpleMessage(to, subject, body);
    }

    public void sendSms(String to, String body) {
        log.info("Sending SMS to {}", to);
        smsService.sendSms(to, body);
    }

    public void sendWhatsApp(String to, String body) {
        log.info("Sending WhatsApp to {}", to);
        whatsAppService.sendWhatsApp(to, body);
    }
}
