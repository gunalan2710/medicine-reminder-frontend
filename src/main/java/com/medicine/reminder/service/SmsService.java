package com.medicine.reminder.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.equals("your_account_sid")) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void sendSms(String to, String body) {
        log.info("Attempting to send SMS to: {}", to);
        try {
            // Ensure 'to' number is valid E.164 format
            if (accountSid != null && !accountSid.equals("your_account_sid")) {
                Message.creator(new PhoneNumber(to), new PhoneNumber(fromNumber), body).create();
                log.info("SMS sent successfully to: {}", to);
            } else {
                log.warn("Twilio not configured. Skipping SMS to: {}", to);
            }
        } catch (Exception e) {
            log.error("Error sending SMS to {}: {}", to, e.getMessage());
        }
    }
}
