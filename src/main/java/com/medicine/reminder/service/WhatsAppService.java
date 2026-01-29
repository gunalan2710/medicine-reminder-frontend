//package com.medicine.reminder.service;
//
//import com.twilio.rest.api.v2010.account.Message;
//import com.twilio.type.PhoneNumber;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//@Service
//public class WhatsAppService {
//
//    @Value("${twilio.whatsapp.number}")
//    private String fromWhatsappNumber;
//
//    public void sendWhatsApp(String to, String body) {
//        try {
//            // 'to' should be in format "whatsapp:+1234567890"
//            String toWhatsapp = to.startsWith("whatsapp:") ? to : "whatsapp:" + to;
//            Message.creator(new PhoneNumber(toWhatsapp), new PhoneNumber(fromWhatsappNumber), body).create();
//        } catch (Exception e) {
//            System.err.println("Error sending WhatsApp: " + e.getMessage());
//        }
//    }
//}
