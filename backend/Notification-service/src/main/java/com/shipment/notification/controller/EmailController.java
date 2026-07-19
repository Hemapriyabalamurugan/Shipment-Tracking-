package com.shipment.notification.controller;

import com.shipment.notification.dto.EmailRequest;
import com.shipment.notification.email.EmailService;
import com.shipment.notification.email.EmailTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final EmailTemplateService templateService;

    @PostMapping("/delivered")
    public String sendDeliveredEmail(
            @RequestBody EmailRequest request)
            throws Exception {

        String html =
                templateService.loadTemplate(
                        "src/main/resources/templates/shipment-delivered.html");

        html =
                templateService.replacePlaceholders(
                        html,
                        request.getCustomerName(),
                        request.getTrackingNumber(),
                        request.getDeliveryDate());

        emailService.sendHtmlEmail(
                request.getEmail(),
                "Shipment Delivered",
                html);

        return "Email Sent Successfully";
    }
}