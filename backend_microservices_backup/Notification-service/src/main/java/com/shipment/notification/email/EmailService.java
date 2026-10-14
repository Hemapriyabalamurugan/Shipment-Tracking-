//package com.shipment.notification.email;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
////@Service
//@RequiredArgsConstructor
//public class EmailService {
//
//    private final JavaMailSender mailSender;
//
//    public void sendEmail(
//            String to,
//            String subject,
//            String body) {
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
package com.shipment.notification.email;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendHtmlEmail(
            String to,
            String subject,
            String htmlContent)
            throws Exception {

        MimeMessage message =
                mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(
                        message,
                        true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}