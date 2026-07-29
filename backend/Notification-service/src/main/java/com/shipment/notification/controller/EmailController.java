package com.shipment.notification.controller;

import com.shipment.notification.dto.EmailRequest;
import com.shipment.notification.email.EmailService;
import com.shipment.notification.email.EmailTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

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
                        "shipment-delivered.html");

//        html =
//                templateService.replacePlaceholders(
//                        html,
//                        request.getCustomerName(),
//                        request.getTrackingNumber(),
//                        request.getDeliveryDate());
        Map<String, String> values = new HashMap<>();

        values.put("customerName", request.getCustomerName());
        values.put("trackingNumber", request.getTrackingNumber());
        values.put("deliveryDate", request.getDeliveryDate());

        html = templateService.replacePlaceholders(
                html,
                values
        );
        emailService.sendHtmlEmail(
                request.getEmail(),
                "Shipment Delivered",
                html);

        return "Email Sent Successfully";
    }
}