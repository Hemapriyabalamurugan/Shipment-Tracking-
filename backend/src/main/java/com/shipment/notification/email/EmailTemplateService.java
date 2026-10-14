package com.shipment.notification.email;

import org.springframework.core.io.ClassPathResource;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Service;

import java.io.IOException;

import java.util.Map;


@Service
public class EmailTemplateService {

//    public String loadTemplate(String templateName)
//            throws IOException {
//
//        ClassPathResource resource =
//                new ClassPathResource(
//                        "templates/" + templateName);
//
//        return new String(
//                resource.getInputStream().readAllBytes(),
//                StandardCharsets.UTF_8
//        );
//    }
public String loadTemplate(String fileName)
        throws IOException {

    ClassPathResource resource =
            new ClassPathResource(
                    "templates/" + fileName);

    return new String(
            resource.getInputStream().readAllBytes(),
            StandardCharsets.UTF_8
    );
}

    public String replacePlaceholders(
            String template,
            Map<String, String> values
    ) {

        for (Map.Entry<String, String> entry : values.entrySet()) {

            template =
                    template.replace(
                            "{{" + entry.getKey() + "}}",
                            entry.getValue()
                    );
        }

        return template;
    }
}