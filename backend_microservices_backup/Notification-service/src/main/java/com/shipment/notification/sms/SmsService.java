//package com.shipment.notification.sms;
//
//import com.twilio.Twilio;
//import com.twilio.rest.api.v2010.account.Message;
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Service;
//
//@Service
//public class SmsService {
//
//    private static final String ACCOUNT_SID = "YOUR_SID";
//    private static final String AUTH_TOKEN = "YOUR_TOKEN";
//    private static final String FROM_NUMBER = "YOUR_NUMBER";
//
//    @PostConstruct
//    public void init() {
//        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
//    }
//
//    public void sendSms(
//            String to,
//            String text) {
//
//        Message.creator(
//                new com.twilio.type.PhoneNumber(to),
//                new com.twilio.type.PhoneNumber(FROM_NUMBER),
//                text
//        ).create();
//    }
//}