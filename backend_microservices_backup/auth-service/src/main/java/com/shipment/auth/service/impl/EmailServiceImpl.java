//
//package com.shipment.auth.service.impl;
//
//import com.shipment.auth.service.EmailService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class EmailServiceImpl implements EmailService {
//
//    private final JavaMailSender mailSender;
//
//    @Override
//    public void sendEmail(
//            String to,
//            String subject,
//            String body
//    ) {
//
//        SimpleMailMessage message =
//                new SimpleMailMessage();
//
//        message.setTo(to);
//        message.setSubject(subject);
//        message.setText(body);
//
//        mailSender.send(message);
//    }
//}

package com.shipment.auth.service.impl;

import com.shipment.auth.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    // Plain-text email
    // Used for login OTP and other simple emails.
    @Override
    public void sendEmail(
            String to,
            String subject,
            String body
    ) {
        System.out.println("==================================================");
        System.out.println("SENDING EMAIL TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("BODY: " + body);
        System.out.println("==================================================");

        try {
            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email sending note (SMTP error): " + e.getMessage());
        }
    }

    // HTML email
    // Used for password-reset email with button.
    @Override
    public void sendHtmlEmail(
            String to,
            String subject,
            String htmlBody
    ) {
        System.out.println("==================================================");
        System.out.println("SENDING HTML EMAIL TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("==================================================");

        try {
            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            false,
                            "UTF-8"
                    );

            helper.setTo(to);
            helper.setSubject(subject);

            // true = HTML content
            helper.setText(htmlBody, true);

            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("HTML Email sending note (SMTP error): " + e.getMessage());
        }
    }
}