package com.shipment.notification.email;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailTemplateService {

    public String loadTemplate(String path)
            throws IOException {

        return Files.readString(
                Paths.get(path));
    }

    public String replacePlaceholders(
            String template,
            String customerName,
            String trackingNumber,
            String deliveryDate) {

        return template
                .replace("{{customerName}}", customerName)
                .replace("{{trackingNumber}}", trackingNumber)
                .replace("{{deliveryDate}}", deliveryDate);
    }
}